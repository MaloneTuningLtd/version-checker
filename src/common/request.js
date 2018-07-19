const https = require('https');
const { URL } = require('url');

const parseUrl = (urlString) => {
  try {
    const url = new URL(urlString);

    return {
      hostname: url.hostname,
      path: url.pathname,
    };
  } catch (e) {
    return null;
  }
}

const getCommonHeaders = () => {
  return {
    'user-agent': 'version-checker',
  };
};

const fetch = exports.fetch = (url) => {
  return new Promise((resolve, reject) => {
    const { hostname, path } = parseUrl(url);

    const options = {
      hostname,
      path,
      headers: getCommonHeaders(),
    }

    https.get(options, (response) => {
      const { statusCode } = response;
      const contentType = response.headers['content-type'];

      if (statusCode !== 200 && statusCode !== 201) {
        const err = new Error('Request Failed.\n' + `Status Code: ${statusCode}\n` + `Path: ${options.path}`)

        if (err) {
          // consume response data to free up memory
          response.resume();
          return reject(err);
        }
      }

      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (/^application\/json/.test(contentType)) {
          try {
            const parsed = JSON.parse(data);
            return resolve(parsed);
          } catch (e) {
            return reject(e);
          }
        } else {
          return resolve(data);
        }
      });
    });
  });
};

const post = exports.post = (url, data) => {
  return new Promise((resolve, reject) => {
    const { hostname, path } = parseUrl(url);

    const options = {
      hostname,
      path,
      headers: {
        ...getCommonHeaders(),
        'content-type': 'application/json',
      },
      method: 'POST',
    };

    const request = https.request(options, (response) => {
      const { statusCode } = response;
      const contentType = response.headers['content-type'];

      if (statusCode !== 200 && statusCode !== 201) {
        const err = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)

        if (err) {
          // consume response data to free up memory
          response.resume();
          return reject(err);
        }
      }

      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (/^application\/json/.test(contentType)) {
          try {
            const parsed = JSON.parse(data);
            return resolve(parsed);
          } catch (e) {
            return reject(e);
          }
        } else {
          return resolve(data);
        }
      });
    });

    // TODO: not so sure about this.
    const postData = JSON.stringify(data);

    request.write(postData);
    request.end();
  });
};

module.exports = {
  fetch,
  post,
};
