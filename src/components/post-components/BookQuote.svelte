<script lang="ts">
	export let book: string;
	export let author: string;
</script>

<div class="book-quote">
	<h1>{book}</h1>
	<p>by {author}</p>
	<slot />
</div>
