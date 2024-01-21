import { Request } from '../../types/index';

let path: string = '';
export const adaptRequest = (req: Request | any) => {
  const reqPath = req.url.split('v1')[1];
  path = reqPath === undefined ? path : reqPath;

  return Object.freeze({
    path: path as string,
    method: req.method as string,
    body: req.body,
    queryParams: req.query as any,
    pathParams: req.params as any,
    headers: req.headers,
    ip: req.ip as string,
    user: req.user as any,
  });
};
