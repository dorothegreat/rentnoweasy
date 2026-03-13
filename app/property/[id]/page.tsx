"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PropertyPage() {
  const { id } = useParams();

  const [property, setProperty] = useState<any>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Load property
      const { data: propertyData } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      setProperty(propertyData);

      // Get current user
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userData.user.id)
          .eq("active", true)
          .single();

        if (sub) setSubscribed(true);
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) return <p className="p-10">Loading...</p>;

  if (!property)
    return <p className="p-10">Property not found</p>;

  return (
    <main className="p-10 space-y-4">
      <h1 className="text-3xl font-bold">
        {property.title}
      </h1>

      <p>📍 {property.location}</p>
      <p>₦{property.price}</p>

      <div className="border p-4 rounded">
        {subscribed ? (
          <p>
            📞 Contact: {property.contact}
          </p>
        ) : (
          <div className="space-y-2">
            <p>
              🔒 Subscribe to view landlord contact
            </p>

            <Link
              href="/subscribe"
              className="bg-blue-600 text-white px-4 py-2 rounded inline-block"
            >
              Subscribe Now
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
