---
title: "How to clean an URL with Regex"
date: "2011-08-20"
categories: 
  - "code"
---

> **Note**: Whatever language you use, there's probably a better way to do this. This post was written back in 2011, which is like 1800 when you adjust for internet-years. Take it with a grain of salt 🙂

A regex pattern to fix 1st level domains. Useful for when data is submitted from users:

Turns this:
```
google.com www.google.com google.com/ http://google.com http://www.google.com http://www.google.com/
```
Into This:

```
http://www.google.com http://www.google.com http://www.google.com http://www.google.com http://www.google.com http://www.google.com
```

Expression:

Search: 

```
((http://)?(www.)?(\[wd-\]\*?.)(w{2,4})/?)
```

Replace:

```
http://www.$4$5
```

PHP Usage:

```php
// Fix the URL:
$fixedURL = preg_replace('/((http://)?(www.)?(\[wd-\]\*?.)(w{2,4})/?)/i', 'http://www.$4$5', $previousURL);
```
