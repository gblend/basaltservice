import jwt from 'jsonwebtoken';
import { config } from '../../config/config';
import { IRefreshTokenUser, ITokenUser } from '../../interface';

const createJWT = (payload: ITokenUser | IRefreshTokenUser) => {
  return jwt.sign(payload, config.jwt.secret);
};

const isTokenValid = (token: string): any =>
  jwt.verify(token, config.jwt.secret);

export { createJWT, isTokenValid };
