const fs = require('fs');
const path = require('path');

const versionsFromFile = require('../../versions.json');

const normalizeVersion = v => {
  if (v === undefined) return undefined;
  if (v.charAt(0) === 'v') return v;
  return 'v' + v;
};

const compareVersions = (cached, recent) => {
  const againstCacheRecent = (versionslist, item) => {
    const { name, version } = item;

    const c = normalizeVersion(cached[name]);
    const r = normalizeVersion(version);

    // check if it's greater
    // if it is, it's been updated ;)
    if (c === undefined || r !== c) {
      versionslist.push({
        ...item,
        oldVersion: c,
      })
    }

    return versionslist;
  };

  return recent.reduce(againstCacheRecent, []);
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
