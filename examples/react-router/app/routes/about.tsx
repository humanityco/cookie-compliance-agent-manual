export default function About() {
  return (
    <section className="about">
      <p className="kicker">About this example</p>
      <h1>One head for every page.</h1>
      <p><code>app/root.tsx</code> owns the document head. Home, About, and Product are routes in that layout, so they share the same banner tags.</p>
      <p>JSX <code>&lt;script&gt;</code> tags are hoisted, the same trap as Next.js. The snippet is an HTML string on <code>&lt;head&gt;</code> so <code>huOptions</code> stays first.</p>
    </section>
  );
}
