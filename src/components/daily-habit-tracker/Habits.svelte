<script lang="ts">
	import { onMount } from "svelte";
	import Entry from "./Entry.svelte";


	type JournalEntry = {
		day: number;
		complete: boolean;
	};

	export let history: number[];
	export let name: string;

	let entries: JournalEntry[] = [];

	const dateToDays = (date: Date) => Math.floor(date.getTime() / 86400000);

	const minDays = 30;
	const today = dateToDays(new Date());
	let start = history[history.length - 1] || today - minDays;
	if (start > today - minDays) {
		start = today - minDays;
	}

	for (let day = start; day <= today; day++) {
		entries.unshift({
			day,
			complete: history.includes(day),
		});
	}

	function getCookie(key) {
		const cookies = document.cookie.split(";");
		const cookie = cookies.find((c) => c.includes(key));
		return cookie ? cookie.split("=")[1] : null;
	}

	let loggedIn = false;
	let isLoading = false;
	let username;
	let token;
	onMount(() => {
		username = getCookie("username");
		token = getCookie("token");
		if (username && token.length >= 32) {
			loggedIn = true;
		}

		// @TODO: Load history from server on page load
		// @TODO: Cache in LocalStorage
	});

	async function submit(e) {
		
		if (!loggedIn) {
			console.error("Not logged in");
			return;
		}

		isLoading = true;

		const targetDay = parseInt(e.srcElement.dataset.day);

		if (!targetDay) {
			return;
		}

		const entryIndex = entries.findIndex(
			(entry) => entry.day === targetDay
		);

		const entry = entries[entryIndex];
		if (!entry) {
			return;
		}
		entry.complete = !entry.complete;
		const response = await fetch(`https://api.pyronaur.com/habits/${name}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-PY-USER": username,
				"X-PY-KEY": token,
			},
			body: JSON.stringify(
				entries
					.filter((entry) => entry.complete)
					.map((entry) => entry.day)
			),
		});
		if (response.status === 200) {
			entries = entries;
		} else {
			// Revert the value on failure
			entry.complete = !entry.complete;
		}
		isLoading = false;
	}
</script>

<div class="track" class:loading={isLoading}>
	{#each entries as entry, i}
		<Entry
			day={entry.day}
			complete={entry.complete}
			actionable={loggedIn}
			on:click={submit}
		/>
	{/each}
</div>

<style lang="scss">
	.track {
		$size: 36px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax($size, 1fr));
		grid-auto-rows: $size;
		gap: 10px;

		&.loading {
			opacity: 0.5;
			pointer-events: none;
		}
	}
</style>
