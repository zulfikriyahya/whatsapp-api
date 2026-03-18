module.exports = {
  apps: [
    {
      name: "wgw-api",
      script: "dist/main.js",
      instances: 1, // WAJIB 1 — whatsapp-web.js tidak thread-safe
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      restart_delay: 3000,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
      time: true,
    },
  ],
};
