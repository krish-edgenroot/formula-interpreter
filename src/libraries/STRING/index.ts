// concatStr.ts
import * as String from './String';

// Implement the function with the interface type
export const CONCATSTR: String.Concatstr = (...args) => {
  return args.join('');
};

export const STRLENGTH: String.strlength = (str) => {
  return str.length;
};