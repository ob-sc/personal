import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';
// bisschen awkward loglevel 1:1 wieder zu exportieren, aber hier war mal pin
// will die imports nicht alle neu machen

prefix.reg(log);
prefix.apply(log);
log.enableAll();

export default log;
