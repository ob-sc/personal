import pino from 'pino';
import { isDev } from './util';

const options = isDev
  ? {
      transport: {
        target: 'pino-pretty',
        options: {
          ignore: 'pid,hostname',
          translateTime: 'HH:MM:ss.l',
        },
      },
      level: 'debug',
    }
  : { level: 'info' };

const logger = pino(options);

export const devmode = () =>
  isDev
    ? // eslint-disable-next-line no-console
      console.log(
        `%cDEVMODE  `,
        'font-size: 64px; font-weight: 600; font-family: sans-serif; color: #ffb300;text-shadow: 1px 1px #000, 2px 2px #100, 3px 3px #200, 4px 4px #300, 5px 5px #400, 6px 6px #500, 7px 7px #600, 8px 8px #700, 9px 9px #800, 10px 10px #900, 11px 11px #a00, 12px 12px #b00, 13px 13px #c00, 14px 14px #d00, 15px 15px #e00, 16px 16px #f00'
      )
    : null;

export default logger;
