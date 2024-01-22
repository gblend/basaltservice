import { appStatus } from '../../src/lib/utils';

describe('AppStatus', () => {
  it('should  return general backend service status data', () => {
    expect(appStatus.compile()).toMatchObject({
      node_version: expect.anything(),
      dep_versions: expect.anything(),
      name: expect.anything(),
      platform: expect.anything(),
      memory_usage: expect.anything(),
      uptime_min: expect.anything(),
      app_version: expect.anything(),
    });
  });
});
