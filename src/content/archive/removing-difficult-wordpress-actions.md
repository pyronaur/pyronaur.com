---
title: "Removing difficult WordPress Actions"
date: "2018-03-04"
categories: 
  - "snippets"
tags: 
  - "hooks"
  - "snippets-2"
---

Actions can only be removed after they've been added. Makes sense. But sometimes actions are added from within loops or down the execution tree somewhere.  

Have a look at this code and try to think how would you remove the `unwanted_message` function from `customize_title` action:

```
// outside the scope of our ability to modify
$titles = [ 'foobar', 'doobar' ];
foreach ( $titles as $raw_title ) {
	$title = apply_filters( 'customize_title', $raw_title );
	do_action( 'render_something' );
	echo $title;
}

// the function we want to unhook
function unwanted_message() {
	echo "Oh Noes!";
}

// somewhere else, also outside our ability to modify
add_filter( 'customize_title',  function ( $name ) {
	add_action( 'render_something', 'unwanted_message' );
	return "<h2>$name</h2>";
} );
```

Can you see what the code above does? It's going to display "_foobar_" and "_doobar_" wrapped in "h2" tags, but it will also call the add the `unwanted_message` function right after. That's the function we don't want in our code.

So how do you remove it if you cannot access the code above?

![](images/image.jpg)

The fix is actually very simple - **remove action before it's triggered on the same action hook**.  You add another action that's executed before `unwanted_message` to remove `unwanted_message`. Like so:

```
add_action( 'customize_title',
	function () {
		remove_action( 'customize_title', 'unwanted_message' );
	},
	5 // lower priority means this will be run before `unwanted_message` callback
);
```

Actions are run in an order by priority. The default priority for all actions is 10, which means that you can run your own action to remove an undesired action. That's it.

## Bonus Round

Using PHP anonymous functions it's easy to make a helper function that's just going to unconditionally detach an action that we don't want. Doing the same thing as above, but in a reusable & pretty way.

```
function always_remove_action( $action, $callback, $priority = 10 ) {

	add_action( $action,
		// Anonymous function to remove the action
		function () use ( $action, $callback, $priority ) {
			remove_action( $action, $callback, $priority );
		},
		// Run this right before the callback
		$priority - 1
	);
}

// Ta-da. An easy way to force remove actions. Just make sure you set the $priority correctly.
always_remove_action( 'customize_title', 'unwanted_function' );
```
