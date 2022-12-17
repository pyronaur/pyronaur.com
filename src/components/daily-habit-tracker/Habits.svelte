<script lang="ts">
	import { onMount } from 'svelte';
	import { toggleHabit, getDays, Habit } from "./api";
	import { getCredentials } from './auth';

  export let habits: Habit[];
  const dailyHabits = getDays(habits);
  const goals = habits.map( habit => habit.slug);

  let filter = '';
  $: days = filter
  	? dailyHabits.map( day => {
		return {
			...day,
			slugs: day.slugs.filter( slug => slug === filter)
		}
	})
	: dailyHabits;
	
	let isLoggedIn = false;

	onMount( () => {
		isLoggedIn = getCredentials() !== false
	})
</script>
{#each habits as habit}
	<button
	class="habit-group"
	class:actionable={isLoggedIn}
	href="#{habit.slug}"
	on:click={ async () => habit = await toggleHabit(habit)}
	on:mouseleave={() => filter = ''}
	on:mouseenter={() => filter = habit.slug}>
		{habit.label}
</button>
{/each}
<div class="habits" class:filter style:--opacity-step={1/(goals.length-1)}>
{#each days as day}
	<div class="day">
		{#each day.slugs as habit}
			<i class="block habit-{habit}"></i>
		{/each}
	</div>
{/each}
</div>

<style lang="scss">
	$size: 24px;


	.actionable {
		cursor: pointer;
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

	button {
		margin-top: 50px;
		margin-bottom: 10px;
		display: inline-block;
		padding: 7px 20px;
		background-color: var(--habit-button);
		color: white;
		text-decoration: none;
		transition: background-color 0.2s ease-in-out;
		border: none;
		font-size: .8em;
		
		&:hover {
			background-color: var(--habit-full);
		}

		&:first-of-type {
			border-top-left-radius: 4px;
			border-bottom-left-radius: 4px;;
		}
		&:last-of-type {
			border-top-right-radius: 4px;
			border-bottom-right-radius: 4px;
		}
	}

	.day {
		position: relative;
		background-color: var(--habit);
		border-radius: 4px;
		overflow: hidden;
	}

	.block {
		display: block;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: 150;

		background-color: var(--habit-done);
		opacity: calc( var(--opacity-step) * 2 );
		mix-blend-mode: var(--habit-blend-mode);
		.filter & {
			opacity: 1;
			background-color: var(--habit-full);
			mix-blend-mode: normal;
		}
	}
</style>
