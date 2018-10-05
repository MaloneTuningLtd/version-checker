# version-checker

A simplistic Node.js script which checks for new versions of software on Github.

## Configuration
There's a `config.js` file in the project directory. There are two configurable values:

- versionsPath
- sourcesPath
- slackHook

An example file `.env.example` is available to see what's expected.

## Hook to Updated Event
Whenever software has been updated, the script uses an event listener to call home to Slack. You can customize it, such as adding functionality or changing the way it calls Slack (currently by [Incoming WebHooks][slack-webhooks]).

You can find the listener in `src/events/listeners/VersionEventListener.js`

[slack-webhooks]:https://api.slack.com/incoming-webhooks

## Adding Github Repositories to Watch
Simply add the repository org and name as an entry inside the `config/sources.json` file.
Please note, however, that the config value `sourcesPath` can be used to override where it reads its sources from.

Example:
```json
{
  "github": [
    "rollup/rollup"
  ]
}

```

## Running Once
By default, `version-checker` stays open and runs daily at 10AM.

To disable this functionality and just run once, start `version-checker` with the env var `DISABLE_SCHEDULER` set to `yes`.

```
DISABLE_SCHEDULER=yes node .
```
