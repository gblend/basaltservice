import xssFilters from 'xss-filters';
import { NextFunction, Response, Request } from '../../types';

/**
 * Clean for xss.
 * @param {string/object} data - The value to sanitize
 * @return {string/object} The sanitized value
 */
const clean = (data: unknown = ''): any => {
  let isObject: boolean = false;
  if (typeof data === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = xssFilters.inHTMLData(data).trim();
  if (isObject && typeof data === 'string') {
    data = JSON.parse(data);
  }

  return data;
};

/**
 * Middleware to clean request body, query and params for xss
 * @return {function} Middleware function
 */
export const xss = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.body) req.body = clean(req.body);
    if (req.query) req.query = clean(req.query);
    if (req.params) req.params = clean(req.params);

    next();
  };
};
