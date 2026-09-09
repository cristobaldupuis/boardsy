import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/shop")({ component: Shop });

function Shop() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-4xl">Shop</h1>
      <p className="mt-2 text-muted">Three locked systems. You fill the names and photos.</p>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {PRODUCTS.map((p) => (
          <Link
            key={p.slug}
            to="/products/$slug"
            params={{ slug: p.slug }}
            className="group block"
          >
            <img
              src={p.image}
              alt={p.name}
              className="aspect-[4/3] w-full rounded-sm object-cover"
            />
            <p className="mt-4 text-xs tracking-[0.2em]">{p.name.toUpperCase()}</p>
            <p className="font-display text-2xl tabular-nums">
              {p.kind === "boardopolis" ? "from " : ""}
              {formatUsd(p.priceFromCents)}
            </p>
            <p className="text-muted">{p.tagline}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
