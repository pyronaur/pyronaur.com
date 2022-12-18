<script lang="ts">
	import { onMount } from "svelte";
	import { toggleHabit, getDays, Habit, getToday } from "./api";
	import { getCredentials } from "./auth";

	export let habits: Habit[];
	const dailyHabits = getDays(habits);
	const goals = habits.map((habit) => habit.slug);

	let filter: string | null = null;
	let reverseFilter: string[] | null = null;
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
		{@const done = habit.history[0] === today}
		{@const active =
			(reverseFilter && reverseFilter.includes(habit.slug)) || done}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="habit-group"
			class:done={active || done}
			class:actionable={isLoggedIn}
			class:reverse-filter={reverseFilter &&
				!reverseFilter?.includes(habit.slug)}
			on:click={async () => (habit = await toggleHabit(habit))}
			on:mouseleave={() => (filter = null)}
			on:mouseenter={() => (filter = habit.slug)}
		>
			{#if isLoggedIn}
				<div class="icon">
					{#if active}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
								clip-rule="evenodd"
							/>
						</svg>
					{:else if filter === habit.slug}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5"
						>
							<path
								fill-rule="evenodd"
								d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z"
								clip-rule="evenodd"
							/>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
								clip-rule="evenodd"
							/>
						</svg>
					{/if}
				</div>
			{/if}
			{habit.label}
		</div>
	{/each}
</div>
<div class="habits" class:filter>
	{#each days as day}
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<div
			class="day level-{level(day.slugs.length)}"
			class:active={day.slugs.includes(filter)}
			on:mouseenter={() => (reverseFilter = day.slugs)}
			on:mouseout={() => (reverseFilter = null)}
		/>
	{/each}
</div>

<style lang="scss">
	$size: 36px;

	.habit-groups {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 10px;
		gap: 16px;
		margin-top: 50px;
	}

	.icon {
		width: 14px;
		height: 14px;
	}

	.habit-group {
		display: flex;
		align-items: center;
		padding: 6px 5px;
		gap: 5px;
		margin-left: -5px;
		text-decoration: none;
		transition: all 0.15s ease-in-out;
		font-size: 16px;
		text-align: left;

		border: none;
		background-color: transparent;

		font-weight: 600;
		border-bottom: 3px solid transparent;

		&.done {
			svg {
				fill: hsl(166, 80%, 40%);
			}
		}
		&:hover {
			border-color: currentColor;
		}
		cursor: default;

		&.reverse-filter {
			opacity: 0.3;
		}
	}
	.actionable {
		cursor: pointer;

		&:hover {
			border-color: hsl(20, 900%, 60%);
			svg {
				fill: hsl(20, 900%, 60%);
			}
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
		cursor: pointer;

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
			background-color: var(--habit-hover-block);
		}
	}
</style>
