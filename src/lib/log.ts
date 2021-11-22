import pino from 'pino';

class logger {
  private pinoDebug = pino({ level: 'debug' });
  private pinoInfo = pino({ level: 'info' });
  private pinoError = pino({ level: 'error' });

  debug(message: any) {
    this.pinoDebug.debug(message);
  }

  info(message: any) {
    this.pinoInfo.info(message);
  }

  error(message: any) {
    this.pinoError.error(message);
  }
}

const log = new logger();

export default log;
