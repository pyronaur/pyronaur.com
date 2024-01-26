---
title: "WP CLI: Add/Update Users in Multisite"
date: "2019-09-11"
categories: 
  - "misc"
  - "snippets"
---

Adding and updating users in a WordPress Multisite is actually pretty simple through WP CLI.

Yet I often forget what the command is, and the official examples sometimes are lacking, so here's a note-to-self:

```
wp user create my_username my@email.com --url=multisite-domain.com --role=administrator
```

To add a user to a sub-site in multisite:

```
wp user update my_username --url=other-multisite.com --role=administrator
```

Hopefully that saves me 3 minutes next time ?
