const { fetch } = require('../common/request');

const githubApi = 'https://api.github.com';
const gradleRepo = 'gradle/gradle';

const url = `${githubApi}/repos/${gradleRepo}/tags`;

const get = async () => {
  let tags = await fetch(url);

  const cmpTags = ({ name: nameA }, { name: nameB }) => {
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  }

  tags = tags.sort(cmpTags);

  return tags;
};

module.exports = () => get().then(versions => (versions.length) ? versions[0] : null);
