import { checkPermissions } from '../../src/lib/utils';

describe('CheckPermission', () => {
  const reqUser = { name: 'Test User', id: 123, role: 'user' };

  it('should  return unauthorized access with invalid resource user id', () => {
    expect(() => checkPermissions(reqUser, 2)).toThrow();
  });

  it('should return true with valid resource user id', () => {
    expect(checkPermissions(reqUser, 123)).toStrictEqual(true);
  });
});
