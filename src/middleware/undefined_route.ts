import { StatusCodes } from 'http-status-codes';
import { Request, Response } from '../types/index';

export const routeNotFound = (_: Request, res: Response) =>
  res.status(StatusCodes.NOT_FOUND).json({
    status: StatusCodes.NOT_FOUND,
    message: 'Route does not exist.',
  });
