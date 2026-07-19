import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY missing");
  return new Stripe(key);
}

export function hasStripe() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export const PLAN_CREDITS = {
  FREE: 100,
  PRO: 2000,
  AGENCY: 10000,
  ENTERPRISE: 999999,
} as const;
