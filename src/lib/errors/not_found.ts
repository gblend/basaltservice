import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom_api';

class NotFoundError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export default NotFoundError;
