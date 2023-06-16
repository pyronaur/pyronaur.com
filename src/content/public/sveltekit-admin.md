---
title: "SvelteKit: A static site without admin"
summary: Build a static site, but have an admin panel too.
date: 2023-06-16
---

I'm working on a site that has an `/admin` route that I want to exclude when the site is built because the site is built using `adapter-static` and it's not happy about dynamic routes that require a server to run. 

 Currently, there isn't a straightforward way to exclude routes using `adapter-static`, so instead, you can:

## Just delete your admin
After various attempts at various configuration options, I came to realize that the simplest solution possible is probably the best path forward here. That is, at least until [there's a way to configure routes](https://github.com/sveltejs/kit/issues/6031) at build time.

Here's a little bash script to help deploy the static site without the admin. The only requirement is that you keep all your admin pages in a specific route that you can remove at build time.

```bash
#!/bin/bash

# Function to print formatted echo messages
echo_green() {
    echo -e "\033[1;32m> $1\033[0m"
}

echo_green "Building site..."
mkdir tmp

echo_green "Moving admin routes to tmp..."
mv src/routes/admin tmp/admin

echo_green "Building site..."
npm run build

echo_green "Moving admin routes back..."
mv tmp/admin src/routes/admin

echo_green "Removing tmp..."
rm -rf tmp

echo_green "🎉 Static site without admin built successfully!"
```

This script does the following:

1. Creates a temporary directory.
2. Moves the admin routes to this temporary directory.
3. Builds the site, effectively excluding the admin routes from the build.
4. Moves the admin routes back to their original location.
5. Deletes the temporary directory.

For the time being, this script provides a reliable way to exclude routes from the static build.