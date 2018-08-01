require('./rancherSecretsBootstrap');
const schedule = require('node-schedule');
const providers = require('./src/providers');

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

const processProviders = () => {
  const cachedVersions = readFromVersionFile();
  
  const processing = Promise.all(providers.map(p => p.provider().then(latest => {
    const version = normalizeVersion(latest[p.property]);

    return (version !== undefined && version !== null)
      ? { name: p.name, version }
      : undefined;
  }))).then(rawProviders => rawProviders.filter(rp => rp !== undefined));

  const postprocessing = [];

  processing.then(viableVersions => {
    const saveVersionsCache = writeToVersionFile(viableVersions);
    const recentlyUpdatedVersions = compareVersions(cachedVersions, viableVersions);

    // emit events
    emitRecentVersions(recentlyUpdatedVersions);

    postprocessing.concat([
      saveVersionsCache,
      recentlyUpdatedVersions,
    ]);
  });

  return Promise.all(postprocessing);
};

// MAIN PROCESS
// Schedule at 4pm :')
console.log('Version Checker: runs every day at 10:00');
schedule.scheduleJob('* 10 * * * *', () => {
  processProviders();
});

// DEBUG
// Or well, at least run this once...
processProviders();
