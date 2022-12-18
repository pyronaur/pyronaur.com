<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { toggleHabit, getDays, Habit, getToday } from "./api";
	import { getCredentials } from "./auth";

	export let habits: Habit[];
	const dailyHabits = getDays(habits);
	const goals = habits.map((habit) => habit.slug);

	let filter = "";
	$: days = filter
		? dailyHabits.map((day) => {
				return {
					...day,
					slugs: day.slugs.filter((slug) => slug === filter),
				};
		  })
		: dailyHabits;

	let isLoggedIn = false;
	const today = getToday();

	onMount(() => {
		isLoggedIn = getCredentials() !== false;
	});

	// Choose a color bucket from 1-5 based on the number of habits
	function level(input: number): number {
		const max = goals.length;
		return Math.ceil(input / (max / 5));
	}
</script>

<div class="habit-groups">
	{#each habits as habit}
		<button
			class="habit-group"
			class:actionable={isLoggedIn}
			class:done={habit.history[0] === today}
			href="#{habit.slug}"
			on:click={async () => (habit = await toggleHabit(habit))}
			on:mouseleave={() => (filter = "")}
			on:mouseenter={() => (filter = habit.slug)}
		>
			{habit.label}
		</button>
	{/each}
</div>
<div class="habits" class:filter>
	{#each days as day}
		<div
			class="day level-{level(day.slugs.length)}"
			class:active={day.slugs.includes(filter)}
		/>
	{/each}
</div>

<style lang="scss">
	$size: 21px;

	.habit-groups {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 10px;
		gap: 10px;
	}

	button {
		margin-top: 50px;
		margin-bottom: 10px;
		padding: 7px 16px;
		text-decoration: none;
		transition: all 0.15s ease-in-out;
		font-size: 0.8em;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;

		border: none;
		background-color: var(--habit-empty);
		color: var(--text-color);

		font-weight: 600;
		
		&:hover {
			color: var(--habit-empty);
			background-color: var(--habit-hover);
			border-color: var(--habit-hover);
		}
	}
	button.actionable {
		cursor: pointer;
		&.done:not(:hover) {
			color: white;
			background-color: var(--habit-done);
			border-color: var(--habit-done);
		}
	}

	.habits {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax($size, 1fr));
		grid-auto-rows: $size;
		gap: 6px;

		&.loading {
			opacity: 0.5;
			pointer-events: none;
		}
	}

	.day {
		position: relative;
		background-color: var(--habit-empty);
		border-radius: 4px;
		overflow: hidden;
		transition: background-color 0.2s ease-in-out;

		&.level-1 {
			background-color: var(--level-1-color);
		}

		&.level-2 {
			background-color: var(--level-2-color);
		}

		&.level-3 {
			background-color: var(--level-3-color);
		}

		&.level-4 {
			background-color: var(--level-4-color);
		}

		&.level-5 {
			background-color: var(--level-5-color);
		}
		.filter &.active {
			background-color: var(--habit-hover);
		}
	}
</style>
