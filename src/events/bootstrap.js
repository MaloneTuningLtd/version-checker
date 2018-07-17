const VersionEventEmitter = require('./emitters/VersionEventEmitter');
const { updated } = require('./listeners/VersionEventListener');

const bootVersionEventEmitter = () => {
  const vee = new VersionEventEmitter();

  // TODO: specify on event listener handlers here.
  vee.on('updated', updated);

  return vee;
};

module.exports = {
  versionEvent: bootVersionEventEmitter(),
};
