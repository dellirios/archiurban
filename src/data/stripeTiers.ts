// Stripe product and price IDs for each subscription tier
// Update the Premium IDs after creating the product in the Stripe Dashboard
export const stripeTiers = {
  basic: {
    product_id: "prod_U5bCig5pAgXJJ9",
    price_id: "price_1T7Q0UDW3CfbVSD5CB7WYrzD",
  },
  pro: {
    product_id: "prod_U5bElzN8LETZHN",
    price_id: "price_1T7Q1mDW3CfbVSD5HBPPgWYp",
  },
  premium: {
    // TODO: Replace with real Stripe IDs after creating in Stripe Dashboard
    product_id: "prod_PREMIUM_PLACEHOLDER",
    price_id: "price_PREMIUM_PLACEHOLDER",
  },
} as const;

export type TierKey = keyof typeof stripeTiers;

export const getTierByProductId = (productId: string): TierKey | null => {
  for (const [key, value] of Object.entries(stripeTiers)) {
    if (value.product_id === productId) return key as TierKey;
  }
  return null;
};
