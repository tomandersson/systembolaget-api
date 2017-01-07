const debug = require('debug');
const env = require('../env');

module.exports = (namespace) => {
  return debug(env.logConfig.namespace + ':' + namespace);
};