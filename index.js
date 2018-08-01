require('./rancherSecretsBootstrap')();

const co = require('co');
const schedule = require('node-schedule');

const { normalizeVersion, compareVersions, readFromVersionFile, writeToVersionFile } = require('./src/versions');
const { versionEvent } = require('./src/events/bootstrap');

const providers = require('./src/providers');

const emitRecentVersions = (recent) => {
  if (!recent && !recent.length) {
    return;
  }

  recent.forEach(({ name, version, oldVersion }) => {
    versionEvent.emit('updated', name, version, oldVersion);
  });
};

const parseVersions = function (source) {
  const { name, property, provider } = source;
  const version = provider().then(v => normalizeVersion(v[property]));
  
  return { name, version };
}

const process = co.wrap(function *() {
  const cached = readFromVersionFile();
  const versions = yield providers.map(parseVersions);

  const saved = writeToVersionFile(versions);
  const updated = compareVersions(cached, versions);

  // emit events
  emitRecentVersions(updated);

  // final result
  yield [].concat([saved, updated]);
});

// MAIN PROCESS
// Schedule at 10am :')
console.log('Version Checker: runs every day at 10:00am');
schedule.scheduleJob('0 10 * * * *', () => {
  process();
});

// DEBUG
// Or well, at least run this once...
process();
