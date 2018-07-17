const fs = require('fs');
const path = require('path');

const versionsFromFile = require('../../versions.json');

const normalizeVersion = v => {
  if (v === undefined) return undefined;
  if (v.charAt(0) === 'v') return v;
  return 'v' + v;
};

const compareVersions = (cached, recent) => {
  const hasBeenUpdated = recent.filter((rec) => {
    const { name, version } = rec;
    
    const cachedVersion = normalizeVersion(cached[name]);
    const recentVersion = normalizeVersion(version);

    // check if it's the same
    // if not it's been updated ;)
    if (cachedVersion !== undefined) {
      return recentVersion !== cachedVersion;
    }

    // doesn't exist, it's been updated ;)
    return true;
  });

  // TODO: debug only
  // hasBeenUpdated.forEach(({ name, version }) => {
  //   const oldVersion = normalizeVersion(cached[name]);
  //   const newVersion = normalizeVersion(version);

  //   if (oldVersion !== undefined && oldVersion !== null) {
  //     console.log(`${name} has been recently updated to ${newVersion} from ${oldVersion}`);
  //   } else {
  //     console.log(`${name} has been recently updated to ${newVersion}`)
  //   }
  // });

  return hasBeenUpdated;
};

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
    const jsonFilePath = path.resolve(__dirname, '../../versions.json');
    const jsonifiedVersions = JSON.stringify(versions, null, '  ');

    return new Promise((resolve, reject) => {
      console.log('Writing \'versions.json\'\n');
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

module.exports = {
  normalizeVersion,
  compareVersions,
  readFromVersionFile,
  writeToVersionFile,
};
