import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRazorpay } from "@/lib/razorpay/server";

// Special Sale - ends March 14, 2026
const SALE_END_DATE = new Date("2026-03-14T23:59:59");
const IS_SALE_ACTIVE = new Date() < SALE_END_DATE;

// ─── Plan pricing in smallest currency unit (paise for INR, cents for USD) ────
interface PlanConfig {
  amount: number;
  tier: string;
  name: string;
  period: string;
  currency: string;
}

// Regular pricing
const REGULAR_PLANS: Record<string, PlanConfig> = {
  // Basic – INR
  basic_monthly_inr:     { amount: 39900,   tier: "basic",    name: "Basic Monthly",     period: "monthly", currency: "INR" },
  basic_yearly_inr:      { amount: 399900,  tier: "basic",    name: "Basic Yearly",      period: "yearly",  currency: "INR" },
  // Basic – USD
  basic_monthly_usd:     { amount: 490,     tier: "basic",    name: "Basic Monthly",     period: "monthly", currency: "USD" },
  basic_yearly_usd:      { amount: 4900,    tier: "basic",    name: "Basic Yearly",      period: "yearly",  currency: "USD" },

  // Pro – INR
  pro_monthly_inr:       { amount: 99900,   tier: "pro",      name: "Pro Monthly",       period: "monthly", currency: "INR" },
  pro_yearly_inr:        { amount: 999900,  tier: "pro",      name: "Pro Yearly",        period: "yearly",  currency: "INR" },
  // Pro – USD
  pro_monthly_usd:       { amount: 1190,    tier: "pro",      name: "Pro Monthly",       period: "monthly", currency: "USD" },
  pro_yearly_usd:        { amount: 11900,   tier: "pro",      name: "Pro Yearly",        period: "yearly",  currency: "USD" },

  // Pro Plus – INR
  pro_plus_monthly_inr:  { amount: 129900,  tier: "pro_plus", name: "Pro Plus Monthly",  period: "monthly", currency: "INR" },
  pro_plus_yearly_inr:   { amount: 1299900, tier: "pro_plus", name: "Pro Plus Yearly",   period: "yearly",  currency: "INR" },
  // Pro Plus – USD
  pro_plus_monthly_usd:  { amount: 1490,    tier: "pro_plus", name: "Pro Plus Monthly",  period: "monthly", currency: "USD" },
  pro_plus_yearly_usd:   { amount: 14900,   tier: "pro_plus", name: "Pro Plus Yearly",   period: "yearly",  currency: "USD" },
};

// Sale pricing
const SALE_PLANS: Record<string, PlanConfig> = {
  // Basic – INR
  basic_monthly_inr:     { amount: 29900,   tier: "basic",    name: "Basic Monthly (Launch Sale)",    period: "monthly", currency: "INR" },
  basic_yearly_inr:      { amount: 299900,  tier: "basic",    name: "Basic Yearly (Launch Sale)",     period: "yearly",  currency: "INR" },
  // Basic – USD
  basic_monthly_usd:     { amount: 390,     tier: "basic",    name: "Basic Monthly (Launch Sale)",    period: "monthly", currency: "USD" },
  basic_yearly_usd:      { amount: 3900,    tier: "basic",    name: "Basic Yearly (Launch Sale)",     period: "yearly",  currency: "USD" },

  // Pro – INR
  pro_monthly_inr:       { amount: 69900,   tier: "pro",      name: "Pro Monthly (Launch Sale)",      period: "monthly", currency: "INR" },
  pro_yearly_inr:        { amount: 699900,  tier: "pro",      name: "Pro Yearly (Launch Sale)",       period: "yearly",  currency: "INR" },
  // Pro – USD
  pro_monthly_usd:       { amount: 790,     tier: "pro",      name: "Pro Monthly (Launch Sale)",      period: "monthly", currency: "USD" },
  pro_yearly_usd:        { amount: 7900,    tier: "pro",      name: "Pro Yearly (Launch Sale)",       period: "yearly",  currency: "USD" },

  // Pro Plus – INR
  pro_plus_monthly_inr:  { amount: 99900,   tier: "pro_plus", name: "Pro Plus Monthly (Launch Sale)", period: "monthly", currency: "INR" },
  pro_plus_yearly_inr:   { amount: 999900,  tier: "pro_plus", name: "Pro Plus Yearly (Launch Sale)",  period: "yearly",  currency: "INR" },
  // Pro Plus – USD
  pro_plus_monthly_usd:  { amount: 990,     tier: "pro_plus", name: "Pro Plus Monthly (Launch Sale)", period: "monthly", currency: "USD" },
  pro_plus_yearly_usd:   { amount: 9900,    tier: "pro_plus", name: "Pro Plus Yearly (Launch Sale)",  period: "yearly",  currency: "USD" },
};

function getPlans() {
  return IS_SALE_ACTIVE ? SALE_PLANS : REGULAR_PLANS;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { planId } = body;

    const plans = getPlans();
    const plan = plans[planId];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    let razorpay;
    try {
      razorpay = getRazorpay();
    } catch (configError) {
      console.error("Razorpay config error:", configError);
      return NextResponse.json(
        { error: "Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
        { status: 500 }
      );
    }

    // Create Razorpay order
    let order;
    try {
      const shortId = user.id.substring(0, 8);
      const timestamp = Date.now().toString(36);
      const receipt = `rcpt_${shortId}_${timestamp}`.substring(0, 40);

      order = await razorpay.orders.create({
        amount: plan.amount,
        currency: plan.currency,
        receipt,
        notes: {
          userId: user.id,
          tier: plan.tier,
          planId: planId,
          period: plan.period,
        },
      });
    } catch (razorpayError: unknown) {
      console.error("Razorpay order creation error:", razorpayError);
      const errorObj = razorpayError as { error?: { description?: string }; message?: string };
      const errorDesc = errorObj?.error?.description || errorObj?.message || JSON.stringify(razorpayError);
      return NextResponse.json(
        { error: `Razorpay error: ${errorDesc}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      planName: plan.name,
      userEmail: user.email,
      userId: user.id,
      tier: plan.tier,
    });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { error: `Failed to create order: ${errorMessage}` },
      { status: 500 }
    );
  }
}
