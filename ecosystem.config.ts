import { config } from './src/config/config';
import { IEcosystemConfig } from './src/interface';

const configOption: IEcosystemConfig = {
  name: config.app.name,
  script: 'dist/server.js',
  min_uptime: 36000,
  ignore_watch: ['logs', 'coverage', '.git', '.gitignore'],
  watch_options: {
    followSymlinks: false,
  },
  error_file: './logs/pm2.log',
  combine_logs: true,
  max_restarts: 3,
  exec_mode: 'cluster',
  instances: 2,
  env_production: {
    NODE_ENV: 'production',
  },
  env_development: {
    NODE_ENV: 'development',
  },
};

module.exports = {
  apps: [configOption],
};
