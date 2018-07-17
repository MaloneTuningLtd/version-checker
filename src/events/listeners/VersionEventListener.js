const { post } = require('../../common/request');

const SLACK_URL = 'https://hooks.slack.com/services/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';

const formatSlackMessage = (name, version) => ({
    text: `${name} has been recently updated!`,
    attachments: [{
      title: name,
      text: `Updated to ${version}`,
    }],
});

const sendSlackMessage = (url, message) => post(url, message);

const updated = (name, version) => {
  console.log('EVENT (update): ', name, version);
  return sendSlackMessage(SLACK_URL, formatSlackMessage(name, version));
};

module.exports = {
  updated,
};
