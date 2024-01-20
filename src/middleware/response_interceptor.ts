import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from '../types/index';

export const responseInterceptor = (
  _: Request,
  res: Response,
  next: NextFunction,
): void => {
  const successMessage: string = 'Request processed successfully.';
  const errorMessage: string = 'Request failed.';

  const originJson = res.json;
  res.json = ({ data = {}, message = '' }) => {
    const statusCode: number = res.statusCode;
    const statusText: string = ![
      StatusCodes.OK,
      StatusCodes.NO_CONTENT,
      StatusCodes.CREATED,
    ].includes(statusCode)
      ? 'error'
      : 'success';
    message = !message && statusText === 'success' ? successMessage : message;
    message = !message && statusText === 'error' ? errorMessage : message;

    return originJson.call(res, { status: statusText, message, data });
  };

  next();
};
