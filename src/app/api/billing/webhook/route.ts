import { headers } from "next/headers";
import { jsonError, jsonOk } from "@/lib/api";
import { getStripe, hasStripe, PLAN_CREDITS } from "@/lib/stripe";
import { hasDatabase, prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (!hasStripe()) return jsonError("Stripe not configured", 503);

  const stripe = getStripe();
  const body = await req.text();
  const headerList = await headers();
  const sig = headerList.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (secret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, secret);
    } else {
      event = JSON.parse(body);
    }
  } catch {
    return jsonError("Invalid webhook signature", 400);
  }

  if (!hasDatabase()) {
    return jsonOk({ received: true, demo: true, type: event.type });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as {
        customer?: string;
        subscription?: string;
        metadata?: { userId?: string; plan?: string };
      };
      if (session.metadata?.userId) {
        const plan = (session.metadata.plan ?? "PRO") as keyof typeof PLAN_CREDITS;
        await prisma.user.update({
          where: { id: session.metadata.userId },
          data: {
            stripeCusId: session.customer,
            stripeSubId: session.subscription,
            role: plan === "AGENCY" ? "AGENCY" : plan === "ENTERPRISE" ? "ENTERPRISE" : "PRO",
            credits: PLAN_CREDITS[plan] ?? PLAN_CREDITS.PRO,
          },
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as { customer?: string };
      if (sub.customer) {
        await prisma.user.updateMany({
          where: { stripeCusId: String(sub.customer) },
          data: { role: "FREE", credits: PLAN_CREDITS.FREE, stripeSubId: null },
        });
      }
      break;
    }
    default:
      break;
  }

  return jsonOk({ received: true });
}
