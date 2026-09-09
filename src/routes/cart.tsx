import { createFileRoute, Link } from "@tanstack/react-router";
import { cartTotal, useCart } from "@/lib/cart";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/cart")({ component: Cart });

function Cart() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const total = cartTotal(items);

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-4xl">Cart</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-muted">
          Empty.{" "}
          <Link to="/shop" className="text-ink underline">
            Shop the games
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 py-5">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted">
                  {item.title} · {item.qty} · {item.photos} photos
                </p>
                {item.spaces?.length ? (
                  <p className="mt-1 text-xs text-muted">
                    {item.spaces.filter(Boolean).slice(0, 4).join(" · ")}
                    {item.stations?.filter(Boolean).length ? ` · ${item.stations.filter(Boolean)[0]}` : ""}
                  </p>
                ) : null}
              </div>
              <div className="text-right">
                <p className="tabular-nums">{formatUsd(item.priceCents)}</p>
                <button type="button" className="text-sm text-muted underline" onClick={() => remove(item.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {items.length > 0 ? (
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <p className="tabular-nums">Total {formatUsd(total)}</p>
          <Link to="/checkout" className="rounded-full bg-terracotta px-6 py-3 text-sm text-cream">
            Checkout
          </Link>
        </div>
      ) : null}
    </main>
  );
}
