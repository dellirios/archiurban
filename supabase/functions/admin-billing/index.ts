import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-BILLING] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);

    // Check super_admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user!.id)
      .eq("role", "super_admin")
      .maybeSingle();

    if (!roleData) throw new Error("Unauthorized: super_admin role required");
    logStep("User authorized as super_admin");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Fetch all active/trialing/past_due subscriptions
    const subscriptions = await stripe.subscriptions.list({
      limit: 100,
      expand: ["data.customer", "data.items.data.price.product"],
    });
    logStep("Fetched subscriptions", { count: subscriptions.data.length });

    const subs = subscriptions.data.map((sub) => {
      const customer = sub.customer as Stripe.Customer;
      const price = sub.items.data[0]?.price;
      const product = price?.product as Stripe.Product;
      return {
        id: sub.id,
        tenant: customer?.name || customer?.email || "—",
        plan: product?.name || "—",
        status: sub.status,
        startDate: new Date(sub.start_date * 1000).toISOString().split("T")[0],
        nextBilling: sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString().split("T")[0]
          : null,
        amount: (price?.unit_amount || 0) / 100,
        currency: price?.currency || "brl",
      };
    });

    // Fetch recent charges/payments
    const charges = await stripe.charges.list({ limit: 50 });
    logStep("Fetched charges", { count: charges.data.length });

    const payments = charges.data.map((ch) => ({
      id: ch.id,
      tenant: ch.billing_details?.name || ch.receipt_email || "—",
      date: new Date(ch.created * 1000).toISOString().split("T")[0],
      amount: (ch.amount || 0) / 100,
      currency: ch.currency || "brl",
      status: ch.status,
      method: ch.payment_method_details?.type || "—",
    }));

    // Compute MRR from active subs
    const mrr = subs
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + s.amount, 0);

    return new Response(
      JSON.stringify({ subscriptions: subs, payments, mrr }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(
      JSON.stringify({ error: msg }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
