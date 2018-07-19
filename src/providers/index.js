const { githubRepo } = require('./common/github.provider');

module.exports = [
  githubRepo('gradle', 'gradle/gradle'),
  githubRepo('composer', 'composer/composer'),
  githubRepo('phpunit', 'sebastianbergmann/phpunit'),
  githubRepo('npm', 'npm/cli'),
  githubRepo('yarn', 'yarnpkg/yarn'),
];
