import { registerAs } from "@nestjs/config";

export default registerAs("whatsapp", () => ({
  authPath: process.env.WA_AUTH_PATH || "./storage/sessions",
  headless: process.env.WA_HEADLESS !== "false",
  maxReconnectRetries: parseInt(process.env.WA_MAX_RECONNECT_RETRIES, 10) || 10,
  warmingIntervalMinMs:
    parseInt(process.env.WARMING_INTERVAL_MIN_MS, 10) || 300000,
  warmingIntervalMaxMs:
    parseInt(process.env.WARMING_INTERVAL_MAX_MS, 10) || 600000,
}));
