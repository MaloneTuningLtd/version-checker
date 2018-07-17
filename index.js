const fs = require('fs');
const path = require('path');

const versionsFromFile = require('./versions.json');
const { versionEvent } = require('./src/events/bootstrap');

const providers = [
  {
    name: 'gradle',
    property: 'name',
    provider: require('./src/providers/gradleVersions'),
  },
];

const readFromVersionFile = () => {
  const versions = {};

  if (versionsFromFile !== undefined && versionsFromFile.length) {
    versionsFromFile.forEach((thing) => {
      if (thing !== undefined &&
        thing.name !== undefined &&
        thing.version !== undefined) {
          versions[thing.name] = thing.version;
        }
    });
  }

  return versions;
};

const writeToVersionFile = (versions) => {
  try {
    const jsonFilePath = path.resolve(__dirname, 'versions.json');
    const jsonifiedVersions = JSON.stringify(versions);

    return new Promise((resolve, reject) => {
      console.log('Writing \'versions.json\'');
      fs.writeFile(jsonFilePath, jsonifiedVersions, 'utf-8', (err => {
        if (err) {
          return reject(err);
        }

        return resolve();
      }));
    });

  } catch (e) {
    return false;
  }
};

const compareVersions = (cached, recent) => {
    const hasBeenUpdated = recent.filter((rec) => {
      const { name, version } = rec;
      const old = cached[name];

      // check if it's the same
      // if not it's been updated ;)
      if (old !== undefined) {
        return version !== old;
      }

      // doesn't exist, it's been updated ;)
      return true;
    });

    // TODO: debug only
    hasBeenUpdated.forEach(({ name, version }) => {
      const oldVersion = cached[name];

      if (oldVersion !== undefined && oldVersion !== null) {
        console.log(`${name} has been recently updated to ${version} from ${oldVersion}`);
      } else {
        console.log(`${name} has been recently updated to ${version}`)
      }
    });

    return hasBeenUpdated;
};

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
    const version = latest[p.property];

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

processProviders();