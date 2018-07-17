const schedule = require('node-schedule');

const { normalizeVersion, compareVersions, readFromVersionFile, writeToVersionFile } = require('./src/versions');
const { versionEvent } = require('./src/events/bootstrap');

const providers = [
  {
    name: 'gradle',
    property: 'name',
    provider: require('./src/providers/gradle.version'),
  },
  {
    name: 'composer',
    property: 'name',
    provider: require('./src/providers/composer.version'),
  },
  {
    name: 'phpunit',
    property: 'name',
    provider: require('./src/providers/phpunit.version'),
  },
  {
    name: 'npm',
    property: 'name',
    provider: require('./src/providers/npm.version'),
  },
  {
    name: 'yarn',
    property: 'name',
    provider: require('./src/providers/yarn.version'),
  },
];

const emitRecentVersions = (recent) => {
  if (!recent && !recent.length) {
    return;
  }

  recent.forEach(({ name, version }) => {
    versionEvent.emit('updated', name, version);
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
// processProviders();
