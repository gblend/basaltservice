import { nextTick } from 'process';

export const useCallback = (fn: (...args: any) => any, args: any): void => {
  nextTick(fn(args));
  return;
};
