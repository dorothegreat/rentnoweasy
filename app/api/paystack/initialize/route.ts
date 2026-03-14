import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        amount: 300000, // ₦3000 example (Paystack uses kobo)
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success`,
      }),
    }
  );

  const data = await response.json();

  return NextResponse.json(data);
}