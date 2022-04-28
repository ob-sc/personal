import { NextApiRequest, NextApiResponse } from 'next';
import { dataSource } from '../server/database';
import { isEmpty } from './shared';

type NextApiRequestWithDB = NextApiRequest & { db?: typeof dataSource };

export type NextApiHandlerWithDB = (
  req: NextApiRequestWithDB,
  res: NextApiResponse
) => Promise<void>;

export function requiredField(...args: (string | null | undefined)[]) {
  for (const arg of args) {
    if (isEmpty(arg)) {
      throw new Error(`Argument ${arg} fehlt`);
    }
  }
}

export const NULL = {
  nullable: true,
  // default: null,
};

// automatisch not null
// export const NOT_NULL = { nullable: false };

export const UNIQUE = { unique: true };
