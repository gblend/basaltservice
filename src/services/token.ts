import Token, { ITokenAttributes } from '../models/Token';
import { ITokenUser } from '../interface';
import { UnauthenticatedError } from '../lib/errors';
import { generateToken } from '../lib/utils';

export class TokenService {
  async findOne(filter: any): Promise<Token | null> {
    return await Token.findOne(filter);
  }

  async saveInfo(user: ITokenUser, ip: string, headers: any): Promise<Token> {
    const isTokenExist: Token | null = await this.findOne({
      where: { userId: user.id },
    });
    if (isTokenExist) {
      if (!isTokenExist.isValid) {
        throw new UnauthenticatedError('Invalid credentials');
      }
      return isTokenExist;
    }

    const refreshToken: string = generateToken();
    const userAgent = headers['user-agent'] || 'unknown';
    const userToken: ITokenAttributes = {
      refreshToken,
      ip,
      userAgent,
      userId: user.id!,
    };
    return Token.create(userToken);
  }

  async destroy(filter: any): Promise<void> {
    await Token.destroy(filter);
  }
}
