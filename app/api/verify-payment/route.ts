import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);

    const { error } = await supabaseAdmin
      .from("subscriptions")
      .upsert({
        user_id: userId,
        active: true,
        expires_at: expires.toISOString(),
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
