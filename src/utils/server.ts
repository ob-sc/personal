import { isEmpty } from './shared';

export const requiredField = (...args: (string | null | undefined)[]) => {
  for (const arg of args) {
    if (isEmpty(arg)) {
      throw new Error(`Argument ${arg} fehlt`);
    }
  }
};

export const NULL = { nullable: true, default: null };

export const NOT_NULL = { nullable: false };

export const UNIQUE = { unique: true };
