import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class AiService {
  private logger = new Logger("AiService");
  private genAI: GoogleGenerativeAI | null = null;
  private isDisabled = false;
  private model: string;
  private timeoutMs: number;
  private defaultThreshold: number;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    // FIX: forwardRef karena NotificationsModule → GatewayModule → SessionsModule bisa circular
    @Inject(forwardRef(() => NotificationsService))
    private notifications: NotificationsService,
  ) {
    this.model = config.get("gemini.model");
    this.timeoutMs = config.get("gemini.timeoutMs");
    this.defaultThreshold = config.get("gemini.confidenceThreshold");
    const apiKey = config.get<string>("gemini.apiKey");
    if (apiKey) this.init(apiKey);
  }

  init(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.isDisabled = false;
    this.logger.log("Gemini AI initialized");
  }

  async getReply(
    userId: string,
    message: string,
    persona: string,
  ): Promise<string | null> {
    if (this.isDisabled)
      throw new ServiceUnavailableException({ code: ErrorCodes.AI_DISABLED });

    const userSetting = await this.prisma.userSetting.findUnique({
      where: { userId },
    });
    const threshold =
      userSetting?.geminiConfidenceThreshold ?? this.defaultThreshold;

    let genAI = this.genAI;
    if (userSetting?.geminiApiKey)
      genAI = new GoogleGenerativeAI(userSetting.geminiApiKey);
    if (!genAI)
      throw new ServiceUnavailableException({ code: ErrorCodes.AI_DISABLED });

    const prompt = `${persona}\n\nUser message: "${message}"\n\nRespond ONLY with valid JSON: {"intent":"string","reply":"string","confidence":number}`;

    try {
      const model = genAI.getGenerativeModel({ model: this.model });
      const result = (await Promise.race([
        model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), this.timeoutMs),
        ),
      ])) as any;

      const text = result.response.text();
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

      if (parsed.confidence < threshold) {
        this.logger.debug(
          `AI confidence ${parsed.confidence} below threshold ${threshold}`,
        );
        return null;
      }
      return parsed.reply;
    } catch (e) {
      if (e.status === 403 || e.status === 400) {
        this.isDisabled = true;
        this.logger.error("Gemini API key invalid — AI disabled");

        // FIX: Kirim notifikasi ke user yang bersangkutan + admin email
        const user = await this.prisma.user
          .findUnique({ where: { id: userId }, select: { email: true } })
          .catch(() => null);
        if (user?.email) {
          this.notifications.notifyAiDisabled(userId, user.email);
        }

        throw new ServiceUnavailableException({ code: ErrorCodes.AI_DISABLED });
      }
      this.logger.error(`Gemini error: ${e.message}`);
      return null;
    }
  }
}
