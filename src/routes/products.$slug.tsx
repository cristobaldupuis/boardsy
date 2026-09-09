import { createFileRoute, Link } from "@tanstack/react-router";
import { BoardBuilder } from "@/components/board-builder";
import { CasaBuilder } from "@/components/casa-builder";
import { getProduct } from "@/lib/products";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/products/$slug")({ component: ProductPage });

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);

  if (!product) {
    return (
      <main className="px-5 py-20 text-center">
        <p>We don’t make that one — yet.</p>
        <Link to="/shop" className="mt-4 inline-block text-terracotta">
          Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      {product.kind === "casa" ? <CasaBuilder product={product} /> : <BoardBuilder product={product} />}
      <ul className="mt-12 grid gap-2 text-sm text-muted md:grid-cols-2">
        {product.includes.map((line) => (
          <li key={line}>· {line}</li>
        ))}
      </ul>
      {product.fundraise ? (
        <p className="mt-6 max-w-xl text-sm text-muted">
          {product.fundraise.school} keeps {formatUsd(product.fundraise.keepCents.board)} /{" "}
          {formatUsd(product.fundraise.keepCents.silver)} / {formatUsd(product.fundraise.keepCents.gold)} of Board /
          Silver / Gold. A classroom edition you can pitch this week.
        </p>
      ) : null}
      <p className="mt-6 text-sm text-muted">{product.leadTime}</p>
    </main>
  );
}
