<script lang="ts">
	import { onMount, tick } from "svelte";
	import { quartOut } from "svelte/easing";

	let darkMode: boolean | undefined;

	onMount(async () => {
		const darkSession = window.sessionStorage.getItem("darkMode");
		if (null === darkSession) {
			darkMode = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
		} else {
			darkMode = "true" === darkSession;
		}
	});

	function toggleDarkMode(e: KeyboardEventInit) {
		if (e.key !== "Escape") {
			return;
		}
		darkMode = !darkMode;
	}

	$: if (undefined !== darkMode) {
		if (darkMode) {
			document.body.classList.remove("light");
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
			document.body.classList.add("light");
		}
		sessionStorage.setItem("darkMode", darkMode.toString());
	}

	function spin(node, { duration }) {
		return {
			duration,
			css: (t) => {
				const eased = quartOut(t);
				const direction = darkMode ? 1 : -1;
				return `transform: scale(${eased}) rotate(${
					eased * 360 * direction
				}deg);`;
			},
		};
	}
</script>

<svelte:window on:keydown={toggleDarkMode} />

{#if darkMode !== undefined}
	<button class="toggle-dark-mode" on:click={() => (darkMode = !darkMode)}>
		{#if darkMode}
			<img
				in:spin={{ duration: 600 }}
				src="/assets/moon.svg"
				alt="Enable Light Mode"
				class="dark-icon"
			/>
		{:else}
			<img
				in:spin={{ duration: 600 }}
				src="/assets/sun.svg"
				alt="Enable Dark Mode"
				class="light-icon"
			/>
		{/if}
	</button>
{/if}

<style lang="scss">
	.toggle-dark-mode {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		outline: 0;
	}
</style>
