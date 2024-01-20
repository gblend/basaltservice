import { StatusCodes } from 'http-status-codes';
import { adaptRequest, logger } from '../lib/utils';
import { NextFunction, Request, Response } from '../types/index';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { path, method } = adaptRequest(req);

  const customError = {
    // set defaults
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong. Please try again later.',
  };

  if (err.message.indexOf('already in use') !== -1) {
    customError.message = err.message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(',');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  logger.error(
    `${customError.statusCode} - ${customError.message} - ${method} ${path}`,
  );
  return res.status(customError.statusCode).json({
    data: {
      errors: [customError.message],
    },
  });
};
