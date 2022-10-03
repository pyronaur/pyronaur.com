<script lang="ts">
	export let book: string;
	export let author: string;
</script>

<section class="book-quote grid__full">
	<blockquote>
		<slot />
		<cite>
			&mdash; excerpt from &ldquo;<strong>{book}</strong>&rdquo;
			 by {author}
		</cite>
	</blockquote>

	{#if $$slots.note}
		<aside>
			<div class="sticky">
				<strong>Side Note</strong>
				<slot name="note" />
			</div>
		</aside>
	{/if}
</section>

<style lang="scss">
	.book-quote {
		background-color: var(--accent-background);
		color: var(--accent-text);
		display: grid;
		padding: 40px 0;
		gap: 40px;
		grid-template-columns: minmax(20px, 2fr) 720px minmax(20px, 2fr);
		
		&:has(aside) {
			grid-template-columns: 2fr minmax(420px, 620px) 320px 2fr;
		}
		@media screen and (max-width: 1100px) {
			font-size: .9rem;
		}

		@media screen and (max-width: 800px) {
			display: block;
			padding: 40px;
			aside {
				margin-top: 40px;
			}
		}
	}
	blockquote {
		font-family: serif;
		grid-column: 2;

		font-size: 1.2em;
		:global(p) {
			margin-bottom: 10px;
		}
	}
	cite {
		display: block;
		margin-bottom: 10px;
		font-size: 0.7rem;
	}

	aside {
		grid-column: 3;
		font-size: 0.85rem;
		color: var(--accent-mild);
		font-weight: 500;
		strong {
			text-transform: uppercase;
			letter-spacing: 1px;
			font-size: .75rem;
		}
	}

	.sticky {
		position: sticky;
		align-self: start;
		top: 10px;
	}
</style>
