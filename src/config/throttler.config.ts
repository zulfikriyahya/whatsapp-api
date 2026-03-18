import { registerAs } from '@nestjs/config';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

export default registerAs('throttler', () => ({
  ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
  limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
  authLimit: parseInt(process.env.THROTTLE_AUTH_LIMIT, 10) || 10,
  apiKeyLimit: parseInt(process.env.THROTTLE_API_KEY_LIMIT, 10) || 300,
  broadcastConcurrency: parseInt(process.env.BROADCAST_CONCURRENCY, 10) || 1,
  broadcastRateMax: parseInt(process.env.BROADCAST_RATE_MAX, 10) || 10,
  broadcastRateDurationMs:
    parseInt(process.env.BROADCAST_RATE_DURATION_MS, 10) || 1000,
  webhookConcurrency: parseInt(process.env.WEBHOOK_CONCURRENCY, 10) || 5,
  webhookMaxRetries: parseInt(process.env.WEBHOOK_MAX_RETRIES, 10) || 5,
}));

export const throttlerAsyncOptions: ThrottlerAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    throttlers: [
      {
        ttl: config.get<number>('throttler.ttl') * 1000,
        limit: config.get<number>('throttler.limit'),
      },
    ],
  }),
};
