const { fetch } = require('../../common/request');
const { semverCompare } = require('../../comparison');

const githubApi = 'http://api.github.com';

const getGithubRepoUrl = (repo) => `${githubApi}/repos/${repo}/tags`;

const get = async (url) => {
  let tags = await fetch(url);

  tags = tags.sort(semverCompare('name'));

  return tags;
};

exports.github = repo => () => {
  const url = getGithubRepoUrl(repo);

  return get(url)
    .then(versions => (versions.length) ? versions[0] : null);
};

exports.githubRepo = (name, repoName) => ({
  name,
  property: 'name',
  provider: exports.github(repoName),
});
