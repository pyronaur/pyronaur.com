---
title: "How to dynamically enable Gutenberg"
summary: "There is an easy way to enable/disable the new WordPress Block Editor (Gutenberg) using good old filters."
date: "2018-11-16"
categories: 
  - "code"
  - "tutorials"
  - "wordpress"
---

There is an easy way to enable/disable the new WordPress Block Editor (Gutenberg) using good ol' filters.

Since Gutenberg version 3.5 there is a filter available called `gutenberg_can_edit_post` and in WordPress core the same filter is available under the name: `use_block_editor_for_post`.

## Enable Gutenberg for new posts

Enabling Gutenberg for new posts consists of 2 parts:

1. Check if the current screen is the `post-new.php` page ( for creating a new post )
2. There is a function called `has_blocks()` that's built into Gutenberg and WordPress 5.0 to check if the post content has Gutenberg blocks already in it.  
    

```
function maybe_enable_gutenberg( $can_edit, $post ) {

	// -- For new posts
	// Check for `/wp-admin/post-new.php`
	$current = get_current_screen();
	if ( 'post' === $current->base && 'add' === $current->action ) {
		// If using Classic Editor - return whatever the current default for the site is
		return $can_edit;
	}

	// -- For existing posts

	// Enable Gutenberg in posts with empty post content
	if ( empty( $post->post_content ) ) {
		return $can_edit;
	}

	// Determine whether Gutenberg should be
	// enabled based on whether the post content has blocks
	return has_blocks( $post );
}

// Classic Editor is using hook priority 100
add_filter( 'use_block_editor_for_post', 'maybe_enable_gutenberg', 200, 2 );
```

If you want to - you can use the snippet above with [Classic Editor Plugin](https://wordpress.org/plugins/classic-editor/) - in the plugin settings you can set whatever you want your default to be for new posts.  
  
For current posts, Gutenberg will be enabled or disabled based on whether blocks are used in the post content.

## Enable Gutenberg in a single post

This is one of the simplest examples - disable Gutenberg everywhere (with the snippet above) and then enable Gutenberg in a single post where `ID = 1`

```
function maybe_load_gutenberg( $can_edit, $post ) {

	// Force disable Gutenberg by default
	$can_edit = false;

	// Enable Gutenberg for Post ID 1
	if ( 1 === $post->ID ) {
		$can_edit = true;
	}

	return $can_edit;
}

// WordPress >= 5.0
add_filter( 'use_block_editor_for_post', 'maybe_load_gutenberg', 10, 2 );
```

Now that Gutenberg is disabled by default, here are a few snippets you could use...

## Enable Gutenberg based on Post Meta

You can also load Gutenberg based on post meta data. In this case I'm enabling Gutenberg if the post meta `foobar_setting` has the value `Quick brown fox`, but you can get as creative as you need to be with this:

```
function maybe_load_gutenberg( $can_edit, $post ) {
	
	// Force disable Gutenberg by default
	$can_edit = false;

	/**
	 * Disable Gutenberg if post has a meta
	 * with a key `foobar_setting` and value `Quick brown fox`
	 */
	if ( 'Quick brown fox' === get_post_meta( $post->ID, 'foobar_setting', true ) ) {
		$can_edit = true;
	}

	return $can_edit;
}

/**
 * Only enable Gutenberg where we want to
 */
// WordPress >= 5.0
add_filter( 'use_block_editor_for_post', 'maybe_load_gutenberg', 10, 2 );
```

## Enable Gutenberg for a certain category or tag

Putting it all together - you can enable Gutenberg for all new posts and for all posts in a certain category, and have Gutenberg disabled everywhere else. This is just to illustrate that the filter is very flexible:

```
function maybe_load_gutenberg( $can_edit, $post ) {

	// Force disable Gutenberg by default
	$can_edit = false;

	// Check for `post-new.php`
	$current = get_current_screen();
	if ( 'post' === $current->base && 'add' === $current->action ) {
		return true;
	}

	// Check whether the content has blocks already in it:
	if ( has_blocks( $post ) ) {
		return true;
	}

	if ( has_category( 'nice-category', $post ) ) {
		return true;
	}

	return $can_edit;
}

// WordPress >= 5.0
add_filter( 'use_block_editor_for_post', 'maybe_load_gutenberg', 10, 2 );
```

## Enable or disable Gutenberg by post type

While you could use the snippets above to enable or disable Gutenberg by post type as well, doing something like this:

```
if ( 'bananas' === get_post_type( $post ) ) {
	return false;
}
```

I'd recommend to instead use the filter designed for post types: `gutenberg_can_edit_post_type`

Do this instead:

```
function maybe_load_gutenberg_for_post_type( $can_edit, $post_type ) {

	if ( 'bananas' === $post_type ) {
		return true;
	}

	return $can_edit;
}

// WordPress >= 5.0
add_filter( 'use_block_editor_for_post_type', 'maybe_load_gutenberg_for_post_type', 10, 2 );
```

## That's it!

Sky is the limit here - enable Gutenberg based on the post publish date, allow Gutenberg by tags and so on.
