<script lang="ts">
	import { onMount } from "svelte";

	function isDarkMode() {
		// Allows this function to be run early without waiting for onMount
		if (import.meta.env.SSR) {
			return false;
		}

		const sessionData = window.sessionStorage.getItem("darkMode");
		if (sessionData) {
			return "true" === sessionData;
		}

		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	}

	function toggleWithKeyboard(e: KeyboardEventInit) {
		if (e.key !== "Escape") {
			return;
		}
		darkMode = !darkMode;
	}

	function triggerSpin(duration: number) {
		spin = true;
		setTimeout(() => (spin = false), duration);
	}

	function toggleColorScheme(enableDarkMode = false) {
		// Allows this function to be run early without waiting for onMount
		if (import.meta.env.SSR) {
			return false;
		}

		const sessionData = window.sessionStorage.getItem("darkMode");
		if( sessionData && enableDarkMode === ("true" === sessionData) ) {
			return;
		}

		// Change the body class based on the current status.
		if (enableDarkMode) {
			spinDirection = "left";
			document.body.classList.remove("light");
			document.body.classList.add("dark");
		} else {
			spinDirection = "right";
			document.body.classList.remove("dark");
			document.body.classList.add("light");
		}

		// Trigger the animation
		triggerSpin(650);

		// Save the dark mode status in the session storage.
		sessionStorage.setItem("darkMode", darkMode.toString());
	}

	onMount(() => {
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", (e) => {
				darkMode = e.matches;
			});
	});

	let spinDirection: "left" | "right" = "right";
	let darkMode = isDarkMode();
	let spin = false;
	$: toggleColorScheme(darkMode);
</script>

<svelte:window on:keydown={toggleWithKeyboard} />

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
	button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		outline: 0;
	}

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
