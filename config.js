const path = require('path');

module.exports = {
  versionsPath: process.env.VERSION_PATH ||
    path.join(__dirname, 'data', 'versions.json'),
  slackHook: process.env.SLACK_HOOK,
};
