---
title: "Dashes and Underscores in Variables - SASS"
date: "2012-04-03"
summary: "A quick tip about dashes and underscores in SASS variables"
categories: 
  - "tutorials"
---

> "Why aren't my variables working properly in SASS/Compass ?"

Well, one of the reasons could be Underscores and Dashes in SASS (and therefor Compass as well). In case you've missed it - a little quick tip.

### Quick Example

```scss
$var-iable: #b4d455;
body {
 background-color: $var_iable;
}
```

_Compiles to_

```css
body {
 background-color: #b4d455;
}
```

### Say what ?

In SASS it doesn't matter whether your variable has an underscore or a dash - they work both ways. This is something to be aware about. Trying to get two different variables (one with a dash and the other with the underscore) would be a bad practice anyway, but now you know you actually can't :)

### Mixins, functions too...

This doesn't apply only to variables. You can define your mixins and functions one way, and call them the other way.

But just because you can, isn't a good enough reason to start doing that.

### But CSS Doesn't do that...

One might argue, that SASS (SCSS) is aimed to be as close to CSS as possible, and it is. A valid CSS file is a valid SCSS file as well. But dashes aren't considered the same thing as underscores in CSS!

I think the answer is simple: _"some people like underscores, some like dashes"_. That's it.

For example I use underscores most of the time, as it is much, much easier for me to copy-paste variables from one place to another _(double-click variable name with underscores, selects the whole variable name, instead of just one part in Sublime Text)_

### In the end

I think this is actually very useful, as I can (for example) use the whole Compass framework using underscores instead of dashes (which are used by default in Compass), and everything will work properly, as it is meant to.
