import { createJWT } from '../../src/lib/utils';

describe('CreateJWT', () => {
  const userId: number = 123;

  it('should return created JWT string token when payload is provided', () => {
    const generatedToken: string = createJWT({
      name: 'Test',
      role: 'user',
      id: userId,
    });
    expect(typeof generatedToken).toBe('string');
    expect(generatedToken.length).toBeGreaterThan(0);
  });
});
