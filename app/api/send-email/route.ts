import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, message } = await req.json();

    const data = await resend.emails.send({
      from: "Rent Platform <onboarding@resend.dev>",
      to,
      subject: "New message received",
      html: `<p>${message}</p>`,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
