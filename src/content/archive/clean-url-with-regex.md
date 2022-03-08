---
title: "How to clean an URL with Regex"
date: "2011-08-20"
categories: 
  - "code"
---

A regex pattern to fix 1st level domains. Useful for when data is submitted from users:

Turns this:

google.com www.google.com google.com/ http://google.com http://www.google.com http://www.google.com/

Into This:

http://www.google.com http://www.google.com http://www.google.com http://www.google.com http://www.google.com http://www.google.com

Expression:

Search: 
((http://)?(www.)?(\[wd-\]\*?.)(w{2,4})/?)
Replace:
http://www.$4$5

PHP Usage:

	# Fix the URL:
	$fixedURL = preg_replace('/((http://)?(www.)?(\[wd-\]\*?.)(w{2,4})/?)/i', 'http://www.$4$5', $previousURL);
