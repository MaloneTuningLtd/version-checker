const path = require('path');

module.exports = {
  disableScheduler: process.env.DISABLE_SCHEDULER === 'yes',
  versionsPath:
    process.env.VERSION_PATH || path.join(__dirname, '../', 'data', 'versions.json'),
  sourcesPath:
    process.env.SOURCES_PATH || path.join(__dirname, '../', 'data', 'sources.json'),
  slackHook: process.env.SLACK_HOOK,
  githubUser: process.env.GITHUB_USER,
  githubToken: process.env.GITHUB_TOKEN,
};
