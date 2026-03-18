import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { QueueNames } from "../../common/constants/queue-names.constant";
import { subDays } from "date-fns";

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    @InjectQueue(QueueNames.BROADCAST) private broadcastQueue: Queue,
    @InjectQueue(QueueNames.WEBHOOK) private webhookQueue: Queue,
  ) {}

  async getDashboard(userId: string, days = 7) {
    const from = subDays(new Date(), days);

    const [
      totalSent,
      totalSuccess,
      totalBroadcasts,
      recentCampaigns,
      recentLogs,
      chart,
    ] = await Promise.all([
      this.prisma.messageLog.count({
        where: { userId, timestamp: { gte: from } },
      }),
      this.prisma.messageLog.count({
        where: { userId, status: "success", timestamp: { gte: from } },
      }),
      this.prisma.campaign.count({
        where: { userId, createdAt: { gte: from } },
      }),
      this.prisma.campaign.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.messageLog.findMany({
        where: { userId },
        take: 20,
        orderBy: { timestamp: "desc" },
      }),
      this.getChart(userId, days),
    ]);

    const successRate =
      totalSent > 0 ? +((totalSuccess / totalSent) * 100).toFixed(1) : 0;
    return {
      summary: { totalSent, successRate, totalBroadcasts },
      chart,
      recentCampaigns,
      recentLogs,
    };
  }

  async getSystemStatus() {
    const memUsage = process.memoryUsage();
    const [
      totalSessions,
      connectedSessions,
      redisInfo,
      broadcastCounts,
      webhookCounts,
    ] = await Promise.all([
      this.prisma.whatsappSession.count(),
      this.prisma.whatsappSession.count({ where: { status: "connected" } }),
      this.redis.getClient().info("memory"),
      this.broadcastQueue.getJobCounts("waiting", "active", "failed"),
      this.webhookQueue.getJobCounts("waiting", "active", "failed"),
    ]);

    return {
      server: {
        nodeVersion: process.version,
        memory: {
          used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        },
        uptimeSeconds: Math.floor(process.uptime()),
      },
      sessions: {
        total: totalSessions,
        connected: connectedSessions,
        disconnected: totalSessions - connectedSessions,
      },
      queues: { broadcast: broadcastCounts, webhook: webhookCounts },
    };
  }

  private async getChart(userId: string, days: number) {
    const results: any[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      const [total, success] = await Promise.all([
        this.prisma.messageLog.count({
          where: { userId, timestamp: { gte: start, lte: end } },
        }),
        this.prisma.messageLog.count({
          where: {
            userId,
            status: "success",
            timestamp: { gte: start, lte: end },
          },
        }),
      ]);
      results.push({
        date: start.toISOString().split("T")[0],
        total,
        success,
        failed: total - success,
      });
    }
    return results;
  }
}
