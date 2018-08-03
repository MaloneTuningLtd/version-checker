const { fetch } = require('../../common/request');
const { semverCompare } = require('../../comparison');
const { githubUser, githubToken } = require('../../../config');

const githubApi = 'http://api.github.com';
const getGithubRepoUrl = repo => `${githubApi}/repos/${repo}/tags`;

const basicAuthHeader = (username, token) => {
  const creds = new Buffer(username + ':' + token).toString('base64');
  return `Basic ${creds}`;
};

const get = async url => {
  let tags =
    githubUser && githubToken
      ? await fetch(url, {
          headers: {
            Authorization: basicAuthHeader(githubUser, githubToken),
          },
        })
      : await fetch(url);

  tags = tags.sort(semverCompare('name'));

  return tags;
};

exports.github = repo => () => {
  const url = getGithubRepoUrl(repo);

  return get(url).then(versions => (versions.length ? versions[0] : null));
};

exports.githubRepo = (name, repoName) => ({
  name,
  property: 'name',
  provider: exports.github(repoName),
});
