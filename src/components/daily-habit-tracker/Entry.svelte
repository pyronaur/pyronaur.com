<script lang="ts">
	export let complete: boolean;
	export let day: number;
	export let actionable = false;
</script>

<button data-day={day} class:actionable class:complete on:click>
</button>

<style lang="scss">
	button {
		background-color: var(--habit);
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;

		border-radius: 4px;
		font-size: 10px;
		cursor: default;
		outline: 0;
		border: 0;
	}
	.actionable {
		cursor: pointer;
	}
	.complete {
		background-color: var(--habit-done);
	}
</style>
