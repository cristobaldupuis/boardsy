import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { cartTotal, useCart } from "@/lib/cart";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({ component: Checkout });

function Checkout() {
  const items = useCart((s) => s.items);
  const total = cartTotal(items);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");

  if (items.length === 0 && !done) {
    return (
      <main className="px-5 py-16 text-center">
        <p>Your cart is empty.</p>
        <Link to="/shop" className="mt-4 inline-block text-terracotta">
          Shop
        </Link>
      </main>
    );
  }

  if (done) {
    return (
      <main className="mx-auto max-w-lg px-5 py-20 text-center">
        <h1 className="font-display text-4xl">You’re in.</h1>
        <p className="mt-4 text-muted">
          This mock takes no payment. We’ll email a proof to {email || "you"} before anything
          prints. Typical ship: 2–3 weeks.
        </p>
        <Link to="/" className="mt-8 inline-block text-terracotta">
          Back home
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-12">
      <h1 className="font-display text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted">
        Mock checkout — no card charged. Same flow we’d wire to Shopify later.
      </p>
      <p className="mt-6 tabular-nums text-lg">Due {formatUsd(total)}</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          clear();
          setDone(true);
          void navigate({ to: "/checkout" });
        }}
      >
        <label className="block text-sm">
          Email for proof
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-sm border border-border bg-cream px-3 py-3"
          />
        </label>
        <label className="block text-sm">
          Ship to
          <input
            required
            placeholder="Name, city"
            className="mt-1 w-full rounded-sm border border-border bg-cream px-3 py-3"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-terracotta py-3 text-sm text-cream"
        >
          Place founder order
        </button>
      </form>
    </main>
  );
}
