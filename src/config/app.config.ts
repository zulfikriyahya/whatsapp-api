import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  tz: process.env.TZ || "Asia/Jakarta",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3001",
  cookieSecret: process.env.COOKIE_SECRET,
  cookieSecure: process.env.COOKIE_SECURE === "true",
  cookieDomain: process.env.COOKIE_DOMAIN || "localhost",
  adminEmail: process.env.ADMIN_EMAIL,
  storagePath: process.env.STORAGE_PATH || "./storage",
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 50,
  defaultDailyMessageLimit:
    parseInt(process.env.DEFAULT_DAILY_MESSAGE_LIMIT, 10) || 1000,
  defaultMonthlyBroadcastLimit:
    parseInt(process.env.DEFAULT_MONTHLY_BROADCAST_LIMIT, 10) || 10,
  cleanupCron: process.env.CLEANUP_CRON || "0 2 * * *",
  logRetentionDays: parseInt(process.env.LOG_RETENTION_DAYS, 10) || 30,
  auditLogRetentionDays:
    parseInt(process.env.AUDIT_LOG_RETENTION_DAYS, 10) || 90,
}));
