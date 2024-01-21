---
title: What. How. Why.
summary: As you write code, explain the why and not the how or what. Your future self is going to thank you.
date: 2022-10-21
---

You've just solved a problem. It's time to commit.

```sh
git commit -m "use os.homedir() instead of ~"
```

This is a typical commit message that describes the what.

Here's another one:

```sh
remove the trailing slash
```

What's missing? **Context**.

Six months from now you won't know why you did that, and when you look at git blame you'll have no idea.

Developers often forget that a large part of being a developer is communicating well. Computers understand ones and zeroes. They don't need your JavaScript, Ruby, Python, or Rust. We, humans, do.

It's difficult to process information without context. **Why** creates that context.

Instead of 

🙅‍♂️ use os.homedir() instead of  `~` <br>
🤩 `os.homedir()` ensures the path is always resolved.

🙅‍♂️ remove the trailing slash from all the passed in URL <br>
🤩 Ensure consistent URLs by removing trailing slash. This fixes the infinite loop bug.

🙅‍♂️ Add padding to the icons in the menu <br>
🤩 Menu icons were difficult to tap on mobile.


Whenever you `git commit`, think about someone unfamiliar the codebase reading your commit - what do they need to know to understand the context of your commit.

I know.
It's not easy, sometimes it's hard.
But the future you is going to thank you. 
People reading your code are going to thank you.