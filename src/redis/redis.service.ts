import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger("RedisService");
  private client: Redis;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.config.get("redis.host"),
      port: this.config.get("redis.port"),
      password: this.config.get("redis.password"),
      db: this.config.get("redis.db"),
      keyPrefix: this.config.get("redis.keyPrefix"),
    });
    this.client.on("connect", () => this.logger.log("Redis connected"));
    this.client.on("error", (err) => this.logger.error("Redis error", err));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  async get<T>(key: string): Promise<T | null> {
    const val = await this.client.get(key);
    return val ? JSON.parse(val) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const str = JSON.stringify(value);
    if (ttlSeconds) await this.client.set(key, str, "EX", ttlSeconds);
    else await this.client.set(key, str);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.client.expire(key, ttl);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }
}
