// concatStr.ts
import * as String from './String';

// Implement the function with the interface type
export const CONCATSTR: String.Concatstr = (...args) => {
  return args.join('');
};

export const STRLENGTH: String.strlength = (str) => {
  if(typeof str !== 'string') {
    throw new Error(`STRLENGTH: Argument must be a string, but getting "${str}"`);
  }
  return str.length;
};