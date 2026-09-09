import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const board = PRODUCTS[0];
  const cards = PRODUCTS[1];

  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-2 lg:py-16">
        <img
          src="/images/hero-boardopolis.jpg"
          alt="Boardopolis on a sunlit table"
          className="w-full rounded-sm object-cover"
        />
        <div>
          <h1 className="font-display text-5xl leading-[1.1] text-ink md:text-6xl">
            A board game about
            <br />
            your people.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Start with Boardopolis or a deck of Boardsycards. Names, photos, colors. Printed when
            you order.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products/$slug"
              params={{ slug: "boardopolis" }}
              className="rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-cream hover:bg-terracotta-dark"
            >
              Build Boardopolis
            </Link>
            <Link
              to="/products/$slug"
              params={{ slug: "boardsycards" }}
              className="rounded-full border border-ink px-6 py-3 text-sm text-ink"
            >
              Shop cards
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 md:grid-cols-2">
        <ProductTile
          slug={board.slug}
          name={board.name}
          price={board.priceFromCents}
          tagline={board.tagline}
          image={board.image}
        />
        <ProductTile
          slug={cards.slug}
          name={cards.name}
          price={cards.priceFromCents}
          tagline={cards.tagline}
          image={cards.image}
        />
      </section>
    </main>
  );
}

function ProductTile({
  slug,
  name,
  price,
  tagline,
  image,
}: {
  slug: string;
  name: string;
  price: number;
  tagline: string;
  image: string;
}) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug }}
      className="grid items-center gap-4 rounded-sm border border-border bg-cream p-5 md:grid-cols-2"
    >
      <div>
        <p className="text-xs tracking-[0.2em] text-ink">{name.toUpperCase()}</p>
        <p className="mt-2 font-display text-3xl tabular-nums">
          {slug === "boardopolis" ? "from " : ""}
          {formatUsd(price)}
        </p>
        <p className="mt-2 max-w-[12rem] text-muted">{tagline}</p>
      </div>
      <img src={image} alt="" className="h-44 w-full rounded-sm object-cover" />
    </Link>
  );
}
