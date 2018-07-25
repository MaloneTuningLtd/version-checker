# version-checker

A simplistic Node.js script which checks for new versions of software on Github.

## Configuration
There's a `config.js` file in the project directory. There are two configurable values:

- versionsPath
- slackHook

An example file `.env.example` is available to see what's expected.

## Hook to Updated Event
Whenever software has been updated, the script uses an event listener to call home to Slack. You can customize it, such as adding functionality or changing the way it calls Slack (currently by [Incoming WebHooks][slack-webhooks]).

You can find the listener in `src/events/listeners/VersionEventListener.js`

[slack-webhooks]:https://api.slack.com/incoming-webhooks

## Adding Github Repositories to Watch
There's a common `github.provider.js` file which exports a method handler named `githubRepo` which handles fetching the data required from Github's API.

To add another Github project/repository to keep track of you can simply add another line with `githubRepo()` in the `src/providers/index.js` file placing the desired name as the first argument and the repository name as the second argument.

```
githubRepo('version-checker', 'MaloneTuningLtd/version-checker'),
```
