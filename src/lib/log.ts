import pino from 'pino';
import { isDev } from 'src/utils/shared';

const options: pino.LoggerOptions = isDev
  ? {
      level: 'debug',
    }
  : { level: 'info' };

const logger = pino(options);

export default logger;
