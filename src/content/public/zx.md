---
title: ZX
summary: "You should write scripts more, but can't be bothered learning bash?\nTake your terminal back with  `zx`."
date: 2022-09-29
---

Doing the same thing over and over again seems like a waste to me.
Whether it's sending family photos to my NAS after exporting them from Lightroom or nuking all docker images to start fresh.
In theory, bash should be the perfect language to perform these tasks.
I'm sure there are people who love bash, warts, and all.
Not me. But I'm not here to bash bash.
I'm here to talk about  [`zx`](https://github.com/google/zx).

ZX is a small helper utility that provides really good defaults for writing CLI scripts with Node quickly.

It makes it easy to write Node.js CLI scripts that interact with other terminal programs using the `$`. Kind of like jQuery for Node.

```
// List the current directory
await $`ls`
```

It also ships with really good defaults for [argument parsing](https://www.npmjs.com/package/argv), [globbing](https://www.npmjs.com/package/globby) and a `question()` function for interactivity.

## Time well spent.
If it takes me 20 seconds to create a file that has the current date as the filename, I spend `7300` seconds in a year just creating files.
That's 2 hours!
I spend 2 hours a year just creating a markdown file to write my journal every day. 

I much rather spent 2 hours writing code than mindlessly creating files. And so I created this little snippet:

```js
#!/usr/bin/env zx

// Setup variables
const root = `${os.homedir}/Personal/Journal`
const date = new Date();
const todayFileName = date.toISOString().split("T")[0];
const todayFile = `${root}/${todayFileName}.md`;

// This is the Journal template I use every day
const template = `### ${todayFileName}

### Tasks

### Focus

`;

// Make sure that the path exists
if (!(await fs.pathExists(root))) {
    console.log(`${root} does not exist`);
    process.exit(1);
}

// Populate the journal file with the template
// Skip if the file already exists (so I can re-open quickly too)
if (!(await fs.pathExists(todayFile))) {
    await $`echo ${template} >> ${todayFile}`;
}

// Use the Mac open command to open the file in MacDown app
await $`open -a MacDown ${todayFile}`;
```

Took me just a couple of minutes to put together and test, and now I have a shortcut to get journaling quickly.

And that's what I love most about `zx`. It's not as fast as bash, not as neat as python, but it's a language I know really well and I can quickly build an army of robots to speed up my daily tiny tasks.