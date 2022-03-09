---
title: "Auto-start multiple iTerm2 Sessions"
date: "2020-08-27"
categories: 
  - "code"
---

I've recently started working on a project where I have to run multiple terminal based tools/watchers simultaneously, and starting up multiple tabs or panes in multiple directories just for development can get a bit cumbersome.

That made me wonder, is there a way to automate iTerm2 and start multiple sessions with one command? Ideally, all the necessary app sessions would take up only 1 tab. Turns out it's quite easy using [the iTerm Python API](https://www.iterm2.com/python-api/) and iTerm panes.

### How to start multiple terminal panes with one command

**Step 1 - Create a new iTerm2 Script**

Go to Menubar -> Scripts -> Manage -> New Python Script, select "Basic" and then "Simple".

**Step 2 - Edit and paste the following script:**

```python
#!/usr/bin/env python3.7
import iterm2

# The commands to run
cmd_top_left="cd /path/to/script && make runDatastore"
cmd_top_right="cd /path/to/script && make runPubSub"
cmd_bottom_right = "cd /path/to/script && npm run dev"
cmd_bottom_left = "cd /path/to/project2 && npm run dev"

async def main(connection):
    app = await iterm2.async_get_app(connection)
    window = app.current_terminal_window
    
    if window is not None:    
        # Start a new tab
        tab = await window.async_create_tab()
        bottom_left = tab.current_session

        # Split the tab into multiple panes
        top_left = await bottom_left.async_split_pane(vertical=False, before=True)
        top_right = await top_left.async_split_pane(vertical=True)
        bottom_right = await bottom_left.async_split_pane(vertical=True)

        # Run commands on each of the panes
        await bottom_left.async_send_text(cmd_bottom_left + '\n')
        await bottom_right.async_send_text(cmd_bottom_right + '\n')
        await top_left.async_send_text(cmd_top_left + '\n')
        await top_right.async_send_text(cmd_top_right + '\n')

    else:
        # You can view this message in the script console.
        print("No current window")

iterm2.run_until_complete(main)
```

You can use \`await {pane_name}.async_split_pane\` to split and create as many panes as you want in whatever arrangement you'd like. The code above creates 4 panes evenly split in a 2 by 2 square, like so:

![](images/archive/iterm-panes.jpg)

**Step 3: Launch your script**

You can either go to Menubar -> Scripts and select your newly created script, or - just do "cmd + shift + o" in iTerm2, search for your script and hit return.

* * *

That's it. I hope this helps you manage your terminal windows better in the future! 😎
