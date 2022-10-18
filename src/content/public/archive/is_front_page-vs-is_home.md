---
title: "is_front_page() vs is_home()"
date: "2020-11-10"
categories:
  - "code"
  - "wordpress"
---

### Define `is_front_page()`

> This is for what is displayed at your site’s main URL.
>
> Depends on the site’s "Front page displays" Reading Settings ‘show_on_front’ and ‘page_on_front’.
>
> If you set a static page for the front page of your site, this function will return true when viewing that page.
>
> Otherwise the same as @see [is_home()](https://developer.wordpress.org/reference/functions/is_home/)
>
> [https://developer.wordpress.org/reference/functions/is_front_page/](https://developer.wordpress.org/reference/functions/is_front_page/)

### Define `is_home()`

> The blog homepage is the page that shows the time-based blog content of the site.
>
> [is_home()](https://developer.wordpress.org/reference/functions/is_home/) is dependent on the site’s "Front page displays" Reading Settings ‘show_on_front’ and ‘page_for_posts’.
>
> If a static page is set for the front page of the site, this function will return true only on the page you set as the "Posts page".
>
> [https://developer.wordpress.org/reference/functions/is_home/](https://developer.wordpress.org/reference/functions/is_home/)

### Short Version

The home page is the posts page and your front page is the same as home page. If you chose to use a static page, then your home page is your posts page, and front page is the home page. Easy, right?

### Cheatsheet

#### Your latest posts

Start simple. Your homepage display: "Your latest posts"

[!["Your Latest posts"](/images/archive/homepage-latest-page.jpg)](images/archive/homepage-latest-page.jpg)

#### Static page

[![Static page](/images/archive/homepage-static-page.jpg)](images/archive/homepage-static-page.jpg)

|                                  |        |
| -------------------------------- | ------ |
| "Homepage" aka page_on_front:    | Page A |
| "Posts page" aka page_for_posts: | Page B |
| Page A: is_home()                | no     |
| Page A: is_front_page()          | yes    |
| Page B: is_home()                | yes    |
| Page B: is_front_page()          | no     |
  
## TL;DR

In your mind, replace `is_home()` with `is_posts_page()` and it'll be a lot easier to think about. Posts page is home page by default, but it can be moved to a dedicated page, at which point it will no longer be `is_front_page()` but it will still be `is_posts_page()` ( aka `is_home()` )

Naming things is hard.
