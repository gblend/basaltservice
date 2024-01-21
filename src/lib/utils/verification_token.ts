import crypto from 'crypto';
const defaultSize: number = 40;

export const generateToken = (size: number = defaultSize): string => {
  if (size === null || size < 1) size = defaultSize;
  return crypto.randomBytes(size).toString('hex');
};
