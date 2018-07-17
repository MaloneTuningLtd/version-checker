const VersionEventEmitter = require('./VersionEventEmitter');

const bootVersionEventEmitter = () => {
  const vee = new VersionEventEmitter();
  
  // TODO: specify on event listener handlers here.

  return vee;
};

exports.versionEvent = bootVersionEventEmitter();

module.exports = {
  versionEvent: bootVersionEventEmitter(),
};
