<script lang="ts">
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

	function toggleWithKeyboard(e: KeyboardEventInit) {
		if (e.key !== "Escape") {
			return;
		}
		darkModeEnabled = !darkModeEnabled;
	}

	function triggerSpin() {
		spin = true;
		setTimeout(() => (spin = false), spinDuration);
	}

	function changeDarkMode(enable = false) {
		if (import.meta.env.SSR) {
			return false;
		}

		const isDarkModeInDOM = Array.from(document.body.classList).includes(
			"dark"
		);
		if (isDarkModeInDOM === enable) {
			return;
		}

		if (darkModeEnabled) {
			spinDirection = "left"
			document.body.classList.remove("light");
			document.body.classList.add("dark");
		} else {
			spinDirection = "right"
			document.body.classList.remove("dark");
			document.body.classList.add("light");
		}
		triggerSpin();
		window.sessionStorage.setItem("darkMode", darkModeEnabled.toString());
	}

	let spin = false;
	let spinDirection: 'left' | 'right' = 'right';
	const spinDuration = 650;
	let darkModeEnabled = isDarkMode();
	$: changeDarkMode(darkModeEnabled);
</script>

<svelte:window on:keydown={toggleWithKeyboard} />

<button
	class="toggle-dark-mode"
	on:click={() => (darkModeEnabled = !darkModeEnabled)}
>
	<div class="icon" class:spin-left={spin && spinDirection === 'left'} class:spin-right={spin && spinDirection === 'right'}>
		<img src="/assets/moon.svg" alt="Enable Light Mode" class="dark-icon" />
		<img src="/assets/sun.svg" alt="Enable Dark Mode" class="light-icon" />
	</div>
</button>

<style lang="scss">
	.toggle-dark-mode {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		outline: 0;
	}
	@keyframes spin-right {
		0% {
			transform: scale(0) rotate(0deg);
		}
		100% {
			transform: scale(1) rotate(720deg);
		}
	}

	@keyframes spin-left {
		0% {
			transform: scale(0) rotate(0deg);
		}
		100% {
			transform: scale(1) rotate(-720deg);
		}
	}
	:global(.dark) .light-icon {
		display: none;
	}
	:global(.light) .dark-icon {
		display: none;
	}
	.spin-right {
		animation: spin-right 575ms cubic-bezier(0.075, 0.82, 0.17, 1.135);
	}
	.spin-left {
		animation: spin-left 575ms cubic-bezier(0.075, 0.82, 0.17, 1.135);
	}
</style>
