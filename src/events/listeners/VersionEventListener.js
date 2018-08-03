const { post } = require('../../common/request');
const { slackHook } = require('../../../config');

const formatSlackMessage = (name, version, oldVersion) => ({
  text: `${name} has been recently updated!`,
  attachments: [
    {
      title: name,
      text:
        oldVersion !== undefined
          ? `Updated to ${version} from ${oldVersion}`
          : `Updated to ${version}`,
    },
  ],
});

const updated = (name, version) => {
  console.log('EVENT (update): ', name, version);

  if (slackHook && slackHook !== undefined) {
    post(slackHook, formatSlackMessage(name, version));
  }
};

module.exports = {
  updated,
};
