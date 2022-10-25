<script lang="ts">
	import { onMount } from "svelte";
    import { fetchHabit } from "./api";
	import Entry from "./Entry.svelte";
	
	export let history: number[];
	export let name: string;

	type JournalEntry = {
		day: number;
		complete: boolean;
	};

	
	function dateToDays(date: Date) {
		return Math.floor(date.getTime() / 86400000);
	}

	function entriesFromHistory( history ): JournalEntry[] {
		const minDays = 30;
		const today = dateToDays(new Date());
		let start = history[history.length - 1] || today - minDays;
		if (start > today - minDays) {
			start = today - minDays;
		}

		let entries = [];
		for (let day = start; day <= today; day++) {
			entries.unshift({
				day,
				complete: history.includes(day),
			});
		}

		return entries;
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
	onMount(async () => {
		username = getCookie("username");
		token = getCookie("token");
		if (username && token.length >= 32) {
			loggedIn = true;
		}
		if ( entries && !entries[0].complete) {
			const freshHistory = await fetchHabit(name);
			history = freshHistory;
		}
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
		const updatedHistory = entries
			.filter((entry) => entry.complete)
			.map((entry) => entry.day);
		const response = await fetch(`https://api.pyronaur.com/habits/${name}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-PY-USER": username,
				"X-PY-KEY": token,
			},
			body: JSON.stringify(history)
		});
		if (response.status === 200) {
			history = updatedHistory;
		} else {
			// Revert the value on failure
			entry.complete = !entry.complete;
		}
		isLoading = false;
	}

	$: entries = entriesFromHistory(history);

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
