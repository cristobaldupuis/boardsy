import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({ component: Account });

function Account() {
  return (
    <main className="mx-auto max-w-lg px-5 py-16">
      <h1 className="font-display text-4xl">No account needed</h1>
      <p className="mt-4 text-muted">
        Checkout with an email. We send a JPEG proof before print. Logins come later — Dawn-simple
        for now.
      </p>
    </main>
  );
}
