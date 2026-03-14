import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import crypto from "crypto";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("Webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  try {
    const event = JSON.parse(body);

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        const notes = payment.notes;
        const userId = notes?.userId;
        const tier = notes?.tier;

        if (userId && tier) {
          await supabaseAdmin
            .from("profiles")
            .update({ 
              subscription_tier: tier,
              razorpay_customer_id: payment.customer_id || null,
            })
            .eq("id", userId);
        }
        break;
      }

      case "subscription.activated": {
        const subscription = event.payload.subscription.entity;
        const notes = subscription.notes;
        const userId = notes?.userId;
        const tier = notes?.tier;

        if (userId && tier) {
          await supabaseAdmin
            .from("profiles")
            .update({ subscription_tier: tier })
            .eq("id", userId);
        }
        break;
      }

      case "subscription.cancelled":
      case "subscription.expired": {
        const subscription = event.payload.subscription.entity;
        const notes = subscription.notes;
        const userId = notes?.userId;

        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({ subscription_tier: "free" })
            .eq("id", userId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
