const { fetch } = require('../common/request');
const { semverCompare } = require('../comparison');

const githubApi = 'https://api.github.com';
const gradleRepo = 'yarnpkg/yarn';

const url = `${githubApi}/repos/${gradleRepo}/tags`;

const get = async () => {
  let tags = await fetch(url);

  tags = tags.sort(semverCompare('name'));

  return tags;
};

module.exports = () => get().then(versions => (versions.length) ? versions[0] : null);
