import { createJWT } from '../../src/lib/utils';
import { decode } from 'jsonwebtoken';

describe('DecodeJWT', () => {
  it('should return user object if token is decoded', async () => {
    const token = createJWT({ name: 'testUser', role: 'user' });

    const result: any = decode(token);
    delete result.iat;
    expect(result).toMatchObject({ name: 'testUser', role: 'user' });
  });

  it('should null for user when provided token is invalid', async () => {
    const token: string = 'fake token';

    const decoded: any = decode(token);
    expect(decoded).toBe(null);
  });
});
