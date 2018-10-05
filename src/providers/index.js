const fs = require('fs')
const path = require('path')

const { sourcesPath } = require('../../config')
const { githubRepo } = require('./common/github.provider');

const readSourcesFile = (sourceName) => {
  try {
    const sourcePath = path.resolve(sourcesPath)
    const file = fs.readFileSync(sourcePath, 'utf8')

    const sources = JSON.parse(file);

    // TODO: fixme
    return sources[sourceName]
  } catch (e) {
    console.error(e)
    return null;
  }
};

module.exports = () => {
  const github = readSourcesFile('github')

  return github.map(g => {
    const [org, name] = g.split('/')

    return githubRepo(name, g)
  })
}
