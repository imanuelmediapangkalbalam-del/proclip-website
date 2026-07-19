"use client";

import { toast } from "sonner";
import { PLANS } from "@/lib/constants";
import { useAuthStore } from "@/lib/store";

export default function BillingPage() {
  const user = useAuthStore((s) => s.user);
  const setPlan = useAuthStore((s) => s.setPlan);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Billing</h1>
      <p className="mt-2 text-muted">
        Plan aktif: <span className="text-accent">{user?.plan}</span> ·{" "}
        {user?.credits} credits. Stripe portal menyusul di deploy Vercel.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <article key={plan.id} className="card p-6">
            <p className="text-sm text-muted">{plan.name}</p>
            <p className="mt-2 font-display text-3xl font-semibold">${plan.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            {plan.id === "FREE" || plan.id === "PRO" ? (
              <button
                type="button"
                className="btn btn-accent mt-6 w-full"
                onClick={() => {
                  setPlan(plan.id as "FREE" | "PRO");
                  toast.success(`Plan diganti ke ${plan.name} (demo)`);
                }}
              >
                {user?.plan === plan.id ? "Plan aktif" : `Aktifkan ${plan.name}`}
              </button>
            ) : (
              <button type="button" className="btn btn-ghost mt-6 w-full" disabled>
                Coming soon
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
