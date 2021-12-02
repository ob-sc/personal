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

export default logger;
