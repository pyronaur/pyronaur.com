---
title: The Token Limit
summary: A reminder that what we consider the norm today is not going to be the norm of tomorrow.
date: 2023-04-08
---

In 1989, the world of personal computing was starkly different from today. Processors like the Intel 80386 or Motorola 68030, which ran at clock speeds of only a few dozen megahertz, were the norm. Memory was limited, with systems typically having just a few megabytes of RAM, and storage devices measured in megabytes.

Engineers of the time faced significant challenges due to the limited CPU and memory capacities. They had to be resourceful in optimizing their code and finding innovative ways to compress data or reduce processing power requirements.

One prime example of resourcefulness in overcoming these limitations is Jordan Mechner's XOR animation workaround in the development of Prince of Persia. The Apple II computer had a hard limit of 48 kilobytes of memory. This meant developers had to be creative in how they used that limited space. 

The [full interview](https://www.youtube.com/watch?v=sw0VfmXKq54) is on YouTube, but in short - Jordan had to find a way to create compelling characters and enemies within this 48kb limit. This limitation pushed him to create Shadow Man, a ghostly enemy character that was created using an [exclusive-or]() instruction to shift each byte with itself shifted one bit over. This shimmery ghostly outline of the main character became one of the best features of the game and added an unexpected depth to the story.

And that made me think - 
In today's world of natural language processing, we face a new set of challenges and limitations. For instance, models like GPT are limited to 4k-32k tokens. Emerging tools such as Langchain and vector databases are helping developers push the boundaries of language models, but I think that these solutions, like the XOR workaround, are only transitional measures.

What LLMs like GPT are able to do today feels incredible, but we're in the early days of AI, and it's likely that a few years from now, we'll look back at today much like we look back at 1989.


