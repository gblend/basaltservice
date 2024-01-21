interface IAppStatus {
  node_version: string;
  dep_versions: any;
  name: string;
  platform: string;
  memory_usage: any;
  uptime_min: number;
  app_version: string;
}

export { IAppStatus };
