interface IEcosystemConfig {
  name: string;
  script: string;
  min_uptime: number;
  ignore_watch: string[];
  watch_options: {
    followSymlinks: boolean;
  };
  error_file: string;
  combine_logs: boolean;
  max_restarts: number;
  exec_mode: string;
  instances: number;
  env_production: {
    NODE_ENV: string;
  };
  env_development: {
    NODE_ENV: string;
  };
}

export { IEcosystemConfig };
