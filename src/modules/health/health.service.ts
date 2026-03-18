import { Injectable } from "@nestjs/common";
import { RedisService } from "../../redis/redis.service";

@Injectable()
export class HealthService {
  constructor(private redis: RedisService) {}

  async check() {
    try {
      await this.redis.getClient().ping();
      return { status: "ok", redis: "ok", timestamp: new Date().toISOString() };
    } catch {
      return {
        status: "error",
        redis: "unavailable",
        timestamp: new Date().toISOString(),
      };
    }
  }
}
