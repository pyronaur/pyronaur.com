---
title: Constructors should construct
summary: Rule of thumb - keep your constructors pure.
date: 2022-10-31
---

Constructors are a very useful object-oriented language feature.
They provide an easy way to pass in necessary values to newly constructed objects. 

In fact, they're so useful that sometimes they're just too convenient and lead to anti-patterns.

## Rule of thumb
If there's one takeaway from this post, let it be this - **Don't add side effects to your constructors.**

Constructors provide a convenient interface to prepare an object.
They help ensure that an object has the necessary values before any methods are called.

Imagine you're writing a `MarkdownParser` class.
It might be tempting to do something like this:

```
class MarkdownParser {
    private content: string;
    private markdown: string;
    constructor(private filepath: string) {
        this.content = fs.readFileSync(filepath, 'utf8');
        this.markdown = this.parse();
    }
   parse() {
        // ...
    }
}
```

At first glance, it may seem perfectly reasonable - pass in a file and parse the markdown.

This is an anti-pattern.
The constructor isn't strictly preparing the class to be ready for doing the work. 
It's already doing work.

In this case, the constructor is much better off just being a function:

```
function parseMarkdownFile( filepath: string ) {
    const content = fs.readFileSync(filepath, 'utf8');
    const parser = new MarkdownParser(content);
    return parser.parse();
}

class MarkdownParser {
    private markdown: string;
    constructor(private filepath: string) {}
    parse() {
        // ...
    }
}
```

Now the `MarkdownParser` class isn't dependent on the file system anymore.
Its only concern is how the parsing of the passed contents is done.

Of course, this is just one example of side effects happening in constructors.
The filesystem example here is just an example of a side effect.
The same principle applies to a number of things, it could be a random number, an HTTP call, calling an external function that can throw an error, adding event listeners, and so on. 

The important thing to remember is that constructors fall apart when they're not easily predictable. 

Objects should be self-contained and predictable.
Adding external logic in a constructor is making that object unpredictable and untestable.

In other words - think of your constructors as pure functions.
The same inputs should always produce the same outputs.
It shouldn't matter if only one instance is created or a million or if a file exists or not, if there's a network connection or not, etc. - constructors shouldn't deal with any of that.
