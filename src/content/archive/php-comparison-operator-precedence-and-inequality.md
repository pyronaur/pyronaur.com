---
title: "PHP comparison operator precedence and inequality"
date: "2020-01-17"
---

Here's a thought exercise, can you tell exactly under what conditions is the following statement true, and when is it false?

```
$var = get_var();
if( ! 'some value' === $var && ! 'some other value' === $var ) {
  echo "Do the thing";
}
```

At first, you might think that the condition will only execute, if `$var` turns out not to be `'some value'`and `'some other value'` if that was you, take another look, then read on 🙂

The real answer is - "Do the thing" is only going to run when `$var` is `false` because `! "Do the thing"` is evaluated first, and it's cast to a boolean so that PHP can invert it, resulting in `false`.

In other words, the condition above, is the same as:

```
if( false === $var ) {
  echo "Do the thing";
}
```

Here's another example to illustrate how the exclamation point ( `!` ) works in PHP conditions:

```
// Arrays not equal
> ['a', 'b'] == ['a', 'b', 'c']
bool(false)

// Arrays are equal
> ['a', 'b'] == ['a', 'b']
bool(true)

// Array is cast to false by !
> ! ['a', 'b']
bool(false)

// Another example of array cast to false
> ! ['a', 'b', 'c']
bool(false)

// This will cast only 1 array and compare false to the other array
> ! ['a', 'b'] == ['a', 'b', 'c']
bool(false)

// Same as above
> ! ['a', 'b'] == ['a', 'b']
bool(false)
```

The lesson here is to be explicit - if you want to negate a comparison - don't try to save on file size by omitting parenthesis. Or better yet, use strong inequality check directly:

```
// As we established, this is a bug:
! 'value' === $var

// But instead of this
! ( 'value' === $var )

// Do this:
'value' !== $var
```
