import { createFileRoute, Link } from "@tanstack/react-router";
import { BoardBuilder } from "@/components/board-builder";
import { getProduct } from "@/lib/products";

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
      <BoardBuilder product={product} />
      <ul className="mt-12 grid gap-2 text-sm text-muted md:grid-cols-2">
        {product.includes.map((line) => (
          <li key={line}>· {line}</li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">{product.leadTime}</p>
    </main>
  );
}
