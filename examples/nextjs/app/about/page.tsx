export default function AboutPage() {
  return (
    <>
    <section className="about">
      <p className="kicker">About this example</p>
      <h1>One head for every page</h1>
      <p><code>app/layout.tsx</code> owns the document head. Home, About, and Product are routes in that layout, so they share the same banner tags.</p>
    </section>
    </>
  );
}
