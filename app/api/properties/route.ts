import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // ✅ FIX: get all images properly
    const imageFiles = formData.getAll("images") as File[];

    const rent = Number(formData.get("rentAmount")) || 0;
    const serviceCharge = Number(formData.get("serviceCharge")) || 0;
    const cautionFee = Number(formData.get("cautionFee")) || 0;
    const legalFee = Number(formData.get("legalFee")) || 0;

    // ✅ store multiple image urls
    const imageUrls: string[] = [];

    // ✅ upload each image
    for (const imageFile of imageFiles) {
      const fileName = `${Date.now()}-${imageFile.name}`;

      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, buffer, {
          contentType: imageFile.type,
        });

      if (uploadError) {
        return NextResponse.json({ error: uploadError }, { status: 500 });
      }

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      imageUrls.push(data.publicUrl);
    }

    const agent_fee = rent * 0.1;

    const total_package =
      rent + serviceCharge + cautionFee + legalFee + agent_fee;

    const { data, error } = await supabase
      .from("properties")
      .insert({
        title: formData.get("title"),
        description: formData.get("description"),
        location: formData.get("location"),
        property_type: formData.get("property_type"),
        bedrooms: formData.get("bedrooms"),
        bathrooms: formData.get("bathrooms"),
        toilets: formData.get("toilets"),
        furnished: formData.get("furnished"),
        parking: formData.get("parking"),

        rent_amount: rent,
        service_charge: serviceCharge,
        caution_fee: cautionFee,
        legal_fee: legalFee,

        agent_fee,
        total_package,

        // ✅ save multiple images
        images: imageUrls,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}