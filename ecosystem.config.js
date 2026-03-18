module.exports = {
  apps: [
    {
      name: 'wgw-api',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 3000,
      kill_timeout: 10000,
      wait_ready: true,
      listen_timeout: 15000,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      time: true,
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: '5s',
    },
  ],
};

