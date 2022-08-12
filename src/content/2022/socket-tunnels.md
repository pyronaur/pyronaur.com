---
title: Socket Tunnels 
preview: Make SSH Tunnels even better by assigning them to a socket file.
date: 2022-08-12 
---

I've been having a blast with SSH recently. Tunnels are awesome.

Sometimes you want an SSH tunnel to persist, but don't want to keep the terminal tab open just to do that.

There's an easy solution - assign that tunnel to a socket using `-S`, for example:

```sh
ssh -f -N -M -S /tmp/the.sock -L 8242:the_host:8242 the_sock
```

This is a bit labor intensive. I like the socket idea, but I want to be quick about it. Creating aliases is one way of doing it, but lately, I really prefer [zx](https://github.com/google/zx) with [zxb](https://github.com/pyronaur/zxb]:


## SSH Socket utility

So here's a handy zxb script - `zxb create the_sock` is going to create a `the_sock` command:

```mjs
const TMP_FILE = `/tmp/the.sock`;

if (await fs.pathExists(TMP_FILE)) {
	console.log(`${TMP_FILE} already exists, stopping SSH Tunnel`);
	await $`ssh -S ${TMP_FILE} -O exit the_sock`;
} else {
	console.log("Connecting to the_server:8080");
	await $`ssh -f -N -M -S ${TMP_FILE} -L 8080:the_server:8080 the_sock`;
	await $`open http://localhost:8080`;
}
```

It's a toggle!

When it's run for the first time, it's going to create a connection and assign it to `/tmp/the.sock`.

The second time `the_sock` command is going to close the connection and delete the sock file.

