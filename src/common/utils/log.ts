import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

prefix.reg(log);
prefix.apply(log);
log.enableAll();

export default log;
