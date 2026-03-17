import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("properties")
    .select("title, location, description")
    .eq("id", params.id)
    .single();

  if (!data) {
    return {
      title: "Property | RentNowEasy",
    };
  }

  return {
    title: `${data.title} in ${data.location} | RentNowEasy`,
    description: data.description?.slice(0, 160),
    openGraph: {
      title: `${data.title} in ${data.location}`,
      description: data.description,
      type: "website",
    },
  };
}