---
title: Package Driven Development
summary: Pluggable systems are everywhere you look. Learn from the success around you and apply the principle to your projects right now.
date: 2022-08-21
---

Step back and zoom out a little bit, and you'll notice that everything around you is a pluggable system.

Unix Programs are famous for this because it's at the core of the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy).

> The Unix philosophy favors composability as opposed to monolithic design.

The result of this are small, well-tested applications that do just one thing and one thing really well. 

These days the philosophy has been seamlessly adopted by developers without actually noticing:

* Need help with Arrays in JavaScript? Lodash has you covered.
* Want an easy-to-use HTTP framework? Axios is right there.
* Want a CLI Argument parser in Rust? Clap is ready to go.

Almost every language has a package manager to help distribute reusable blocks of code so that we can all do more with less.

And that's what brings me to **Package Driven Development**.
## Package Driven Development
When writing code - pay attention.
You might be inlining package-worthy code without realizing it.

Whether you intend to or not, your code is going to be reused.
Requirements inevitably change and you're going to be the one reusing the code.

If your code is neatly packaged up, you can easily keep some packages and throw out others without worrying if your changes are going to morph into unforeseen bugs.

It's not as difficult as you may think:

* You don't have to OOP.
* You don't need a vision of a grand code architecture.
* You don't need to publish it on npm, crates, or any other packaging tool.

#### The Secret
Recognize pure functions that take in documented inputs and produce predictable and testable outputs and keep them separate from the files that have side effects in them.

That's it!

Not everything in development can be a pure function.
That's okay.
Those are the parts that are likely to change anyway.
That's only more reason to keep as much of your application safely in a package.

When you're vigilant about writing pure code, you'll notice that change is easy.

Instead of accumulating garbage, you'll create a robust codebase that's going to support you in all your future endeavors. 