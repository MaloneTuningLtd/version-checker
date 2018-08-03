const fs = require('fs');
const path = require('path');

const SECRETS_PATH = '/run/secrets';
const ENV_KEY = 'EXPAND_SECRETS';

module.exports = () => {
  if (process.env[ENV_KEY] !== 'yes') {
    return;
  }

  console.log('Boostrapping secrets...');

  const files = fs.readdirSync(SECRETS_PATH);

  files.forEach(file => {
    console.log('Bootstrapped secret', file);
    const content = fs.readFileSync(path.resolve(SECRETS_PATH, file));
    process.env[file] = content;
  });
};
