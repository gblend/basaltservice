import request from 'requestretry';
import * as https from 'https';
import * as http from 'http';
import { logger } from './logger';
import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from '../errors';

export class Retry {
  async request(
    host: string,
    config: any = {},
    method: string = 'GET',
  ): Promise<any> {
    const { requestHost, requestProtocol: protocol } =
      this.formatUrlProtocol(host);

    const response = await request({
      json: true,
      gzip: true,
      timeout: 1000,
      maxAttempts: 3,
      retryDelay: 500,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError,
      headers: {
        'Content-Type': 'application/json',
        ...config,
      },
      method: method,
      url: requestHost,
    });

    if (response.statusCode === StatusCodes.TOO_MANY_REQUESTS) {
      logger.error(response.body.message);
      throw new CustomAPIError(
        response.body.message,
        StatusCodes.TOO_MANY_REQUESTS,
      );
    }

    return response;
  }

  formatUrlProtocol(host: string): {
    requestHost: string;
    requestProtocol: any;
  } {
    let requestProtocol: any = host.indexOf('http://') !== 0 ? https : http;
    if (host.indexOf('https://') !== 0 && host.indexOf('http://') !== 0) {
      // handle url without http(s) prefix
      host = `https://${host}`;
      requestProtocol = https;
    }

    return { requestHost: host, requestProtocol };
  }
}
