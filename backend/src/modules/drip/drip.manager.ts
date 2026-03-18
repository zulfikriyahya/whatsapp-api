import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { SessionManagerService } from "../sessions/session-manager.service";
import { toJid } from "../../common/utils/phone-normalizer.util";
import { replacePlaceholders } from "../../common/utils/placeholder.util";
import { nowWIB, isSameDay } from "../../common/utils/date.util";
import { format, differenceInDays, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Jakarta";

@Injectable()
export class DripManager {
  private logger = new Logger("DripManager");

  constructor(
    private prisma: PrismaService,
    private manager: SessionManagerService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async run() {
    await this.checkNewSubscribers();
    await this.processSteps();
  }

  // Auto-enroll contacts with matching tag
  private async checkNewSubscribers() {
    const campaigns = await this.prisma.dripCampaign.findMany({
      where: { isActive: true },
    });

    for (const campaign of campaigns) {
      const contacts = await this.prisma.contact.findMany({
        where: { userId: campaign.userId, tag: campaign.triggerTag },
      });

      for (const contact of contacts) {
        await this.prisma.dripSubscription
          .upsert({
            where: {
              dripId_contactId: { dripId: campaign.id, contactId: contact.id },
            },
            create: {
              dripId: campaign.id,
              contactId: contact.id,
              startDate: new Date(),
            },
            update: {},
          })
          .catch(() => {}); // Ignore unique constraint violations
      }
    }
  }

  // Process due drip steps
  private async processSteps() {
    const nowWib = toZonedTime(new Date(), TIMEZONE);
    const currentTime = format(nowWib, "HH:mm");

    const subs = await this.prisma.dripSubscription.findMany({
      where: { status: "active" },
      include: {
        drip: { include: { steps: { orderBy: { dayOffset: "asc" } } } },
        contact: true,
      },
    });

    for (const sub of subs) {
      const daysDiff =
        differenceInDays(nowWib, toZonedTime(sub.startDate, TIMEZONE)) + 1;

      const step = sub.drip.steps.find(
        (s) =>
          s.dayOffset === daysDiff &&
          s.timeAt <= currentTime &&
          s.dayOffset > sub.lastStepDay,
      );

      if (!step) continue;

      try {
        const sessionId =
          sub.drip.sessionId ||
          (await this.manager.getHealthySession(sub.drip.userId));
        if (!sessionId) continue;

        const message = replacePlaceholders(step.message, {
          name: sub.contact.name,
        });
        const jid = toJid(sub.contact.number);
        await this.manager.sendMessage(sessionId, jid, message);

        const isLastStep =
          step.dayOffset ===
          Math.max(...sub.drip.steps.map((s) => s.dayOffset));
        await this.prisma.dripSubscription.update({
          where: { id: sub.id },
          data: {
            lastStepDay: step.dayOffset,
            status: isLastStep ? "completed" : "active",
          },
        });
      } catch (e) {
        this.logger.error(`Drip step failed for sub ${sub.id}: ${e.message}`);
      }
    }
  }
}
