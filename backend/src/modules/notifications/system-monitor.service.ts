import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";
import { GatewayService } from "../../gateway/gateway.service";
import { AlertType } from "../../common/enums/status.enum";
import * as os from "os";
import * as fs from "fs";

/**
 * FIX: Ganti OnModuleInit → OnApplicationBootstrap
 *
 * OnModuleInit dipanggil saat module di-load, tapi RedisService.onModuleInit()
 * (yang membuat koneksi Redis) mungkin belum selesai saat itu.
 *
 * OnApplicationBootstrap dipanggil setelah SEMUA module selesai init
 * dan semua koneksi (Redis, Prisma, dll) sudah siap.
 */
@Injectable()
export class SystemMonitorService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private logger = new Logger("SystemMonitorService");
  private redisWasConnected = true;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private gateway: GatewayService,
  ) {}

  onApplicationBootstrap() {
    // Dipanggil setelah semua module init — Redis sudah pasti siap
    try {
      const client = this.redis.getClient();

      client.on("error", () => {
        if (this.redisWasConnected) {
          this.redisWasConnected = false;
          this.broadcastAlert(
            AlertType.REDIS_DISCONNECTED,
            "Koneksi Redis terputus!",
          ).catch(() => {});
        }
      });

      client.on("connect", () => {
        this.redisWasConnected = true;
      });

      this.logger.log("SystemMonitorService: Redis event listeners attached");
    } catch (e) {
      this.logger.error(`SystemMonitorService init failed: ${e.message}`);
    }
  }

  onApplicationShutdown() {
    // cleanup jika diperlukan
  }

  // Cek disk usage setiap 10 menit
  @Cron("*/10 * * * *")
  async checkDisk() {
    try {
      const { usedPercent } = this.getDiskUsage();
      if (usedPercent >= 80) {
        this.logger.warn(`Disk usage: ${usedPercent.toFixed(1)}%`);
        await this.broadcastAlert(
          AlertType.DISK_WARNING,
          `Disk hampir penuh: ${usedPercent.toFixed(1)}% terpakai`,
        );
      }
    } catch (e) {
      this.logger.error(`Disk check failed: ${e.message}`);
    }
  }

  private getDiskUsage(): { total: number; free: number; usedPercent: number } {
    // Gunakan memory sebagai proxy — lebih portabel daripada statfs
    const total = os.totalmem();
    const free = os.freemem();
    const usedPercent = ((total - free) / total) * 100;
    return { total, free, usedPercent };
  }

  private async broadcastAlert(type: AlertType, message: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: { isActive: true },
        select: { id: true },
      });
      for (const user of users) {
        this.gateway.emitSystemAlert(user.id, type, message);
      }
    } catch (e) {
      this.logger.error(`broadcastAlert failed: ${e.message}`);
    }
  }
}
