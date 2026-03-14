"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PropertyImageSlider from "@/components/PropertyImageSlider";
import PageWrapper from "@/app/components/PageWrapper";
import UnlockContactButton from "@/components/UnlockContactButton";

interface Property {
  id: string;
  title: string;
  location: string;
  description: string;
  images?: string[];
  rent_amount: number;
  landlord_phone?: string;
}

export default function PropertyPage() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [phoneVisible, setPhoneVisible] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProperty(data);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const unlockPhone = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      return;
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userData.user.id)
      .single();

    if (!subscription || subscription.unlocks_used >= 5) {
      alert("You need an active subscription to unlock landlord contact.");
      return;
    }

    await supabase
      .from("subscriptions")
      .update({
        unlocks_used: subscription.unlocks_used + 1,
      })
      .eq("id", subscription.id);

    setPhoneVisible(true);
  };

  if (!property) return <div className="p-10">Loading property...</div>;

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-6 py-12">

        <PropertyImageSlider images={property.images || []} />

        <h1 className="text-3xl font-bold mt-6">
          {property.title}
        </h1>

        <p className="text-slate-400 mt-2">
          {property.location}
        </p>

        <p className="text-xl font-semibold mt-4">
          ₦{property.rent_amount?.toLocaleString() || "0"}
        </p>

        <p className="mt-6 text-slate-300">
          {property.description}
        </p>

        {/* Contact Section */}
        <div className="mt-8 p-6 bg-slate-800 border border-slate-700 rounded-xl">

          {!phoneVisible ? (
            <button
              onClick={unlockPhone}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Unlock Landlord Contact
            </button>
          ) : (
            <p className="text-lg font-semibold">
              📞 {property.landlord_phone}
            </p>
          )}

        </div>

      </div>
    </PageWrapper>
  );
}
