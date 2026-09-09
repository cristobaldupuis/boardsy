import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, User } from "lucide-react";
import type { ReactNode } from "react";
import { cartCount, useCart } from "@/lib/cart";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = useCart((s) => s.items);
  const count = cartCount(items);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-bar px-4 py-2 text-center text-sm tracking-wide text-cream">
        Made to order · typically 2–3 weeks
      </div>
      <header className="border-b border-border bg-bg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
          <Link to="/" className="font-sans text-xl font-semibold tracking-[0.28em] text-ink">
            BOARDSY
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-ink md:flex">
            <Link to="/shop" className={navClass(pathname === "/shop")}>
              Shop
            </Link>
            <Link to="/how-it-works" className={navClass(pathname === "/how-it-works")}>
              How it works
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/account" aria-label="Account" className="p-2 text-ink">
              <User className="size-5" strokeWidth={1.5} />
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative p-2 text-ink">
              <ShoppingBag className="size-5" strokeWidth={1.5} />
              {count > 0 ? (
                <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-terracotta text-[10px] text-cream">
                  {count}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border px-5 py-10 text-center text-sm text-muted">
        <p className="mb-2 tracking-[0.2em] text-ink">BOARDSY</p>
        <p>boardsygames.com · Original games. Your people. Printed to order.</p>
      </footer>
    </div>
  );
}

function navClass(active: boolean) {
  return active ? "text-ink" : "text-muted hover:text-ink";
}
