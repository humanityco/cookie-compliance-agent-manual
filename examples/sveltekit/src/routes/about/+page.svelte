<section class="about">
	<p class="kicker">About this example</p>
	<h1>One head for every page</h1>
	<p><code>src/app.html</code> owns the document head. Home, About, and Product share that document through the root layout, so they share the same banner tags.</p>
	<p>The SvelteKit dev server inserts its own client first, and the built page is the one to judge.</p>
</section>
