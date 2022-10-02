<script lang="ts">
	export let content: string;
	const attempts = content.split("\n---\n")
</script>

<div class="failed-attempts">
	{#each attempts as attempt}
		<div class="attempt">
			{attempt}
		</div>
	{/each}
</div>
<slot />

<style lang="scss">
	.attempt {
		font-size: .75em;
		color: #666;
		text-decoration: line-through;
		border-left: solid tomato 4px;
		padding-left: 10px;
		margin-bottom: 10px;
		text-decoration-color: hsla(0, 0%, 60%, 0.5);

	}
</style>