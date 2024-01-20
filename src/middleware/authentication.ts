import { UnauthenticatedError, UnauthorizedError } from '../lib/errors';
import { adaptRequest, isTokenValid, logger, StatusCodes } from '../lib/utils';
import Token from '../models/Token';
import { NextFunction, Request, Response } from '../types/index';
import { ITokenUser } from '../interface';

const authenticateUser = async (
  req: Request | any,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    headers: { authorization, authorization_refresh },
    path,
    method,
  } = adaptRequest(req);
  let accessToken,
    refreshToken = null;

  try {
    if (authorization && authorization.startsWith('Bearer')) {
      // check request header for bearer token
      accessToken = authorization.split(' ')[1];
    }

    if (
      authorization_refresh &&
      authorization_refresh.startsWith('BearerRefresh')
    ) {
      refreshToken = authorization_refresh.split(' ')[1];
    }

    if (accessToken) {
      const { name, id, role }: ITokenUser = isTokenValid(accessToken);
      req.user = { name, id, role };

      return next();
    } else if (refreshToken) {
      const payload: { user: ITokenUser; refreshToken: string } =
        isTokenValid(refreshToken);
      const isTokenExist: Token | null = await Token.findOne({
        where: { userId: payload.user.id, refreshToken: payload.refreshToken },
      });

      if (!isTokenExist || !isTokenExist?.isValid) {
        logger.info(
          `${StatusCodes.UNAUTHORIZED} - Refresh token invalid - ${method} ${path}`,
        );

        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'Unauthorized access' });
      }

      req.user = payload.user;
      return next();
    }

    return next(new UnauthenticatedError('Unauthorized access'));
  } catch (err: any) {
    logger.info(`Authentication error: ${err.message} - ${method} ${path}`);
    throw new UnauthenticatedError('Authentication failed, please try again');
  }
};

const authorizeRoles = (...roles: string[]) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const { user, method, path }: { user: any; method: string; path: string } =
      adaptRequest(req);

    if (!roles.includes(user!.role)) {
      logger.info(
        `${StatusCodes.UNAUTHORIZED} - Unauthorized access error - ${method} ${path}`,
      );

      throw new UnauthorizedError(
        'You are not authorized to access this resource',
      );
    }

    next();
  };
};

export { authenticateUser, authorizeRoles };
