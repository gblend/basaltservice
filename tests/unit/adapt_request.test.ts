import { adaptRequest } from '../../src/lib/utils';

describe('AdaptRequest', () => {
  it('should return extracted request object with values as undefined', () => {
    const req = {
      path: '',
      method: undefined,
      body: undefined,
      queryParams: undefined,
      pathParams: undefined,
      headers: undefined,
      ip: undefined,
      user: undefined,
    };

    expect(adaptRequest({ url: '' })).toMatchObject(req);
  });

  it('should return extracted request object', () => {
    const req = {
      path: '/status',
      method: 'GET',
      body: {},
      queryParams: undefined,
      pathParams: undefined,
      headers: [],
      ip: '127.0.0.1',
      user: {},
    };

    expect(adaptRequest({ ...req, url: '/api/v1/status' })).toMatchObject(req);
  });
});
