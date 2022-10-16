---
title: Push notifications from the CLI
summary: "
Sometimes tasks take a long time. There's an easy way to create a CLI helper to send push notifications when they're done."
date: 2022-10-13
---

Sometimes tasks take a long time.
Having to constantly check whether they're done is neither fun nor productive. 

![XKCD Compiling comic](/images/posts/notify/compiling.png)

But it's a solved problem - notifications.
And they're easy to implement using [zx](/zx) with  [zxb](https://github.com/pyronaur/zxb).

All that's needed is a small wrapper for the [Pushover API](https://pushover.net/api).

## Create a notify CLI helper
Download the Pushover app on your phone, and [register on pushover.net](https://pushover.net/) - there's a free tier that's perfectly suited for this.

Create a pushover APP and store the credentials in your profile file ( `~/.profile` or `~/.zshrc` - whatever is your preference)


```sh
# Somewhere in your shell config:
PUSHOVER_USER=your_username
PUSHOVER_TOKEN=your_token
```

Create a new zx file with zxb:

```sh
zxb create notify
```

Read the pushover credentials:

```js
#!/usr/bin/env zx
$.verbose = false;
const token = process.env.PUSHOVER_TOKEN;
const user = process.env.PUSHOVER_USER;

if (!token || !user) {
    console.error('Missing Pushover token or user');
    process.exit(1);
}
```


The `notify` command should look something like this:

```sh
notify "Database migration complete"
```

`argv` is going to split the input by space, so to get the message, join it back together:

```js
const message = argv._.join(' ');

if (!message) {
    console.error('Missing message');
    process.exit(1);
}
```

Send the message to Pushover using `fetch`:

```js
console.log('Sending message: ', message)
const result = await fetch(`https://api.pushover.net/1/messages.json`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `token=${token}&user=${user}&message=${message}&title=CLI`
});
```

Log whether the CLI managed to send the message:

```js
if (result.status !== 200) {
    console.error('Failed to send the Pushover message');
    process.exit(1);
}

console.log(chalk.green('Notification sent'));
```

Now run your long-running and send the push notification when it's done:

```sh
./reinstall-containers.sh && notify "Container reinstallation complete"
```

This is why I love `zx` in combination with `zxb` - writing small utilities like this is just a couple lines of code.

Anytime I need to send myself a push notification, I've got a CLI command available to me to do that quickly.

If I ever forget whether it was `notification` or `notify` or `pushover` or `push`, I can run `zxb ls` and it'll show me all zxb commands that I've written.