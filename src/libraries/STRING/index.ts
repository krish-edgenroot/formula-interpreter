// concatStr.ts
import { Concatstr } from './String';

// Implement the function with the interface type
export const CONCATSTR: Concatstr = (...args) => {
  return args.join('');
};
