---
title: "Get Attachment ID from media_sideload_image()"
date: "2012-11-14"
categories: 
  - "wordpress"
tags: 
  - "code"
  - "recipes"
  - "snippet"
  - "wordpress-2"
---

#### Problem

In this scenario,

$image = media_sideload_image($downloadable_path, $post_id);

The $image variable now returns the full HTML, like this (with single quotes for some reason)

```html
<img src="http://www.somesite.com/wp-content/uploads/2012/11/image8.jpg" alt="" />
```

Which isn't so bad, unless we want to get Just the image URL, or maybe the Thumbnail URL, or just the attachment ID. Here is how to do it.

Getting the plain Image URL is quite simple, just requires a little bit of REGEX.

```php
$image = preg_replace("/.\*(?<=src=\["'\])(\[^"'\]\*)(?=\["'\]).\*/", '$1', $image);
```

Now it's a little more trickier to get the attachment ID, because it isn't enough to just simply ask for "url_to_postid($url);" as it would work with posts and pages. So I found this neat function [in wordpress forums](http://wordpress.org/support/topic/need-to-get-attachment-id-by-image-url?replies=20)

```php
    function get_attachment_id_from_src ($image_src) {
      global $wpdb;
      $query = "SELECT ID FROM {$wpdb->posts} WHERE guid='$image_src'";
      $id = $wpdb->get_var($query);
      return $id;
    }
```
And now when we put it all together, it looks something like this:

```php
function get_attachment_id_from_src ($image_src) {
      global $wpdb;
      $query = "SELECT ID FROM {$wpdb->posts} WHERE guid='$image_src'";
      $id = $wpdb->get_var($query);
      return $id;
    }

// Upload an Image
$image = media_sideload_image($downloadable_path, $post_id);

// Remove any unwanted HTML, keep just a plain URL (or whatever is in the image src="..." )
$image = preg_replace("/.\*(?<=src=\["'\])(\[^"'\]\*)(?=\["'\]).\*/", '$1', $image);

// Get the Attachment ID
$attachment_id = $this -> get_attachment_id_from_src ($image);
```