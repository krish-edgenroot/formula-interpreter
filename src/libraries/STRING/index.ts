// concatStr.ts
import { ConcatStr } from './String';

// Implement the function with the interface type
export const concatStr: ConcatStr = (joinByStr, ...args) => {
  return args.join(joinByStr);
};
