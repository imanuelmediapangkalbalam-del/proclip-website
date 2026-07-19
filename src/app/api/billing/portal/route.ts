import { auth } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api";
import { getStripe, hasStripe } from "@/lib/stripe";
import { hasDatabase, prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) return jsonError("Unauthorized", 401);

  if (!hasStripe()) {
    return jsonOk({
      url: null,
      demo: true,
      message: "Stripe not configured. Use /app/billing demo plan switcher.",
    });
  }

  const stripe = getStripe();
  let customerId: string | undefined;

  if (hasDatabase()) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    customerId = user?.stripeCusId ?? undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name ?? undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { email: session.user.email },
        data: { stripeCusId: customerId },
      });
    }
  } else {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name ?? undefined,
    });
    customerId = customer.id;
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/app/billing`,
  });

  return jsonOk({ url: portal.url });
}
