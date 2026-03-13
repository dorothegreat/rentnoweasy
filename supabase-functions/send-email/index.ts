import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { to, message } = await req.json();

  return new Response(
    JSON.stringify({
      success: true,
      note: "Email function working",
      to,
      message
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
