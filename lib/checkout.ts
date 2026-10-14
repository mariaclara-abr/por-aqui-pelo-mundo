import { stripe, PACKS, type PackId } from "@/lib/stripe";

export function isPackId(value: string): value is PackId {
  return value in PACKS;
}

export async function createPackCheckoutUrl(
  user: { id: string; email: string },
  plan: PackId,
  origin: string,
  returnPath: string,
) {
  const pack = PACKS[plan];

  const existingCustomers = await stripe.customers.list({ email: user.email, limit: 1 });
  const customerId =
    existingCustomers.data[0]?.id ??
    (
      await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
    ).id;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          unit_amount: pack.amountCents,
          product_data: { name: pack.label },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}${returnPath}?checkout=success`,
    cancel_url: `${origin}${returnPath}?checkout=cancelled`,
    metadata: { supabase_user_id: user.id, plan_type: plan },
  });

  return session.url;
}
