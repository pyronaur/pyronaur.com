---
title: Dark Mode Toggle
preview: How I built a color scheme toggle using Svelte in Astro.
date: 2022-10-07
---

Adding a dark mode toggle to a site seems deceptively easy to do.
In theory, all you need is a button that toggles the body class from light to dark.
But there's a lot more to think about if you want to do it well.

## Basics
Most of the work is going to happen in `SiteThemeToggle.svelte` that's a simple component with a button that contains two SVG icons - moon and the sun:

```svelte
<script lang="ts">
	function toggleColorScheme(enableDarkMode = false) {
        if (enableDarkMode) {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
            document.body.classList.add("light");
        }
    }


	let darkMode = false;
	$: toggleColorScheme(darkMode);
</script>
<button on:click={() => (darkMode = !darkMode)}>
    <div class="icon">
        <img src="/assets/moon.svg" alt="Enable Light Mode" class="icon-moon" />
        <img src="/assets/sun.svg" alt="Enable Dark Mode" class="icon-sun" />
    </div>
</button>

<style lang="scss">
    button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        outline: 0;
    }

    img {
        display: none;
    }

    :global(.dark) .icon-moon {
        display: block;
    }

    :global(.light) .icon-sun {
        display: block;
    }
</style>
```

Notice that both images are hidden by default and one of them is only shown if the body has a `dark` or `light` class.
By doing it this way, if JavaScript hasn't added a class - the graphic isn't going to show up. 
## Persistence: sessionStorage vs localStorage
`localStorage` seems like a popular choice when it comes to persisting user preferences, but is that the right choice?
What if the user comes to visit the site another time and their preference has automatically changed based on the time of day?

I think `sessionStorage` is a much better fit here
Users will get a theme based on their system preferences when they visit the site.
The color scheme can be changed and will persist throughout page navigation, but if the user comes back again, I think it should try its best to use the system preference again.

If you prefer to persist the data indefinitely, feel free to swap out `sessionStorage` for `localStorage`.
The API is the same.
The only difference is that `sessionStorage` persists for a shorter period.

When `toggleColorScheme` is called - persist the data in `sessionStorage`:

```svelte
function toggleColorScheme(enableDarkMode = false) {
	
	// ...

	sessionStorage.setItem("darkMode", darkMode.toString());
}

```

## Toggle on load
Time to detect the theme:

1. Use  `sessionStorage` if it has a value
2. Fall back to system preference

```ts
function isDarkMode() {
    if (import.meta.env.SSR) {
        return false;
    }

    const sessionData = window.sessionStorage.getItem("darkMode");
    if (sessionData) {
        return "true" === sessionData;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
```

During SSR, `window` isn't available. 
That's why a special Vite global `import.meta.env.SSR` is used to prevent the function from accessing the window during SSR.

### Flash Of Blinding Content
Adding `toggleColorScheme` to the `onMount` action would set the right body class when the Svelte component is mounted.

In Astro, I'm using `client:load` directive to load the component asynchronously, which means that `onMount` is going to fire after the page is fully loaded.
That's too late because styles have loaded already, and if the system preference differs from user preference, it's going to cause a "flash of blinding content" on page load.

Adding a little bit of vanilla JavaScript to the top of the page right after the opening `<body>` tag is going to fix that:

```js
<body>
    <script>
        // Set the right color mode based on the user's preferred color scheme.
        const darkMode = sessionStorage.getItem("darkMode");
        if (null !== darkMode) {
            document.body.classList.add(
                darkMode === "true" ? "dark" : "light"
            );
        }
    </script>

```

### Style
The toggle changes the body class when the button is clicked, but it should also respect the user system preferences for dark mode.

Some CSS duplication for defining variables is necessary to respond to both the body class and the user's preferred color scheme.
This is where Sass mixins come in handy:

```scss
@mixin dark {
	--text-color: white;
	--background-color: black;
}

@mixin light {
	--text-color: black;
	--background-color: light;
}

```

In this case, the default color scheme is light so both  `:root` and `.light` selectors are going to be treated as a light color scheme.

But the dark scheme responds to either `.dark` class or if the system color scheme is `prefers-color-scheme: dark`.

```scss
:root {
    &,
    .light {
        @include light();
    }

    .dark {
        @include dark();
    }
}

@media (prefers-color-scheme: dark) {
    :root {
        @include dark();
    }
}

```

I've found this to be the most reliable way to define the color schemes and it works even if JavaScript is disabled.
## Animations
For an extra flourish, I want the toggle to spin when clicked and on the initial page load.

My first go-to here was Svelte animations, but those didn't work out too well because of a few issues:

* Animations need to also trigger on the first load
* Because the Svelte JavaScript is lazily loaded, I want both images to be "pre-rendered" and then hidden with CSS instead of lazy loading them later.

So I'm going with CSS class-based animation triggers.
Whenever the state of the theme changes, I'll flip the `spin` variable that's going to add a `spin-*` class to the button, activating a `spin` animation.

```svelte
<script lang="ts">

    //...
    let spinDirection: "left" | "right" = "right";
    let spin = false;
    function triggerSpin(duration: number) {
        spin = true;
        setTimeout(() => (spin = false), duration);
    }

    function toggleColorScheme(enableDarkMode = false) {

        // ...

        // Trigger the animation
        triggerSpin(650);

        // Save the dark mode status in the session storage.
        sessionStorage.setItem("darkMode", darkMode.toString());
    }

    //...
</script>

<button on:click={() => (darkMode = !darkMode)}>
    <div
        class="icon"
        class:spin-left={spin && spinDirection === "left"}
        class:spin-right={spin && spinDirection === "right"}
    >
        <img src="/assets/moon.svg" alt="Enable Light Mode" class="icon-moon" />
        <img src="/assets/sun.svg" alt="Enable Dark Mode" class="icon-sun" />
    </div>
</button>

<style lang="scss">
    //...
    %spin {
        animation: spin 575ms cubic-bezier(0.075, 0.82, 0.17, 1.135);
    }

    .spin-right {
        @extend %spin;
        @keyframes spin {
            0% {
                transform: scale(0) rotate(0deg);
            }
            100% {
                transform: scale(1) rotate(720deg);
            }
        }
    }
    .spin-left {
        @extend %spin;
        @keyframes spin {
            0% {
                transform: scale(0) rotate(0deg);
            }
            100% {
                transform: scale(1) rotate(-720deg);
            }
        }
    }
    //...
</style>

```

Depending on the direction that the toggle should spin, this will either append a `spin-left` or `spin-right` class.

Svelte and Sass combination come in handy again because I can scope the keyframes to the correct class by using `@extend %spin`.

### Only animate the first time
Animations are great, but too much of a good thing is no longer good. Showing an animation on every page load can get annoying.

The `toggleColorScheme` function is going to run on the page load, which is great for the first page load because it's going to also call `triggerSpin` function, but subsequent page loads in the session don't need to trigger the animation.

`sessionStorage` comes in handy again and can prevent `toggleColorScheme` from running if the dark mode value passed to the function matches that which is stored in `sessionStorage`:

```ts
    function toggleColorScheme(enableDarkMode = false) {

        // ...

        const sessionData = window.sessionStorage.getItem("darkMode");
        if( sessionData && enableDarkMode === ("true" === sessionData) ) {
            return;
        }

        // ...
    }
```

### System Events
One last bit, if the page is open while the user changes the system color scheme - it should also respond to those changes.

To do that, attach an event listener when the dark mode toggle component is loaded:

```js
    onMount(() => {
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) => {
                darkMode = e.matches;
            });
    });

```

## Putting it all together
There was a lot of ground to cover, but I think the end result is worth it - a dark mode that's toggleable by the user and is persisted through the browsing session. In addition, the animations are subtle, but not annoying.

If you want to see how all this works together, you can steal my blog from GitHub:

* [SiteThemeToggle.svelte](https://github.com/pyronaur/pyronaur.com/blob/main/src/components/blog/SiteThemeToggle.svelte)
* [script tag right after the `<body>`](https://github.com/pyronaur/pyronaur.com/blob/fca0ed3abcff5c9642fb67a2cd85b8a4c570ad03/src/components/layouts/blog.astro#L15-L23)
* [Sass Variables](https://github.com/pyronaur/pyronaur.com/tree/main/src/style/variables)
