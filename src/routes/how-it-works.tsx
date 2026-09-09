import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/how-it-works")({ component: How });

function How() {
  const steps = [
    {
      n: "01",
      title: "Pick a system",
      body: "Boardopolis, Boardsycards, or Wilddeck. Geometry is locked so the game still plays.",
    },
    {
      n: "02",
      title: "Drop photos. Rename spaces.",
      body: "A live board, not a spreadsheet. Title, colorway, eight photos, your streets.",
    },
    {
      n: "03",
      title: "We email a proof, then print",
      body: "Made to order. Typically 2–3 weeks. Final after you approve the proof.",
    },
  ];

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-4xl">How it works</h1>
      <p className="mt-3 text-muted">
        Dawn-simple checkout. You never design a game from scratch. We never print Monopoly.
      </p>
      <ol className="mt-12 space-y-10">
        {steps.map((s) => (
          <li key={s.n} className="grid gap-2 border-t border-border pt-6 sm:grid-cols-[4rem_1fr]">
            <p className="text-sm tracking-[0.2em] text-terracotta">{s.n}</p>
            <div>
              <h2 className="font-display text-2xl">{s.title}</h2>
              <p className="mt-2 text-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link
        to="/products/$slug"
        params={{ slug: "boardopolis" }}
        className="mt-12 inline-block rounded-full bg-terracotta px-6 py-3 text-sm text-cream"
      >
        Build Boardopolis
      </Link>
    </main>
  );
}
