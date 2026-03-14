import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  const body = await req.text();

  const hash = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  const signature = req.headers.get("x-paystack-signature");

  // Verify request came from Paystack
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  // Only handle successful payments
  if (event.event === "charge.success") {

    const email = event.data.customer.email;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // find user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (profile) {

  // 🔍 CHECK IF USER ALREADY HAS ACTIVE SUBSCRIPTION
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", profile.id)
    .eq("status", "active")
    .maybeSingle();

  // ✅ ONLY CREATE NEW SUBSCRIPTION IF NONE EXISTS
  if (!existing) {
    await supabase.from("subscriptions").insert({
      user_id: profile.id,
      status: "active",
      max_unlocks: 5,
    });
  }
    }
}

  return NextResponse.json({ received: true });
}