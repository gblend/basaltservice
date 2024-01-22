import {
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  CustomAPIError,
  BadRequestError,
} from '../../src/lib/errors';
import { StatusCodes } from '../../src/lib/utils';

describe('NotFoundError', () => {
  it('should return not found error', () => {
    const message = 'Resource not found.';
    const notFound = new NotFoundError(message);
    expect(notFound.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(notFound.message).toBe(message);
  });
});

describe('UnauthenticatedError', () => {
  it('should return unauthenticated error', () => {
    const message = 'Authentication failed.';
    const unauthenticated = new UnauthenticatedError(message);
    expect(unauthenticated.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(unauthenticated.message).toBe(message);
  });
});

describe('UnauthorizedError', () => {
  it('should return unauthorized error', () => {
    const message = 'Unauthorized access.';
    const unauthorized = new UnauthorizedError(message);
    expect(unauthorized.statusCode).toBe(StatusCodes.FORBIDDEN);
    expect(unauthorized.message).toBe(message);
  });
});

describe('CustomAPIError', () => {
  it('should return custom API error', () => {
    const message = 'Custom message.';
    const customAPIError = new CustomAPIError(message);
    expect(customAPIError.message).toBe(message);
  });
});

describe('BadRequestError', () => {
  it('should return bad request error', () => {
    const message = 'Bad request.';
    const badRequestError = new BadRequestError(message);
    expect(badRequestError.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(badRequestError.message).toBe(message);
  });
});
