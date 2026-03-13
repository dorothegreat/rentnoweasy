"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function FavoritesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);

    const { data: userData } =
      await supabase.auth.getUser();

    if (!userData.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("favorites")
      .select(`
        property_id,
        properties (*)
      `)
      .eq("user_id", userData.user.id);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const props =
      data?.map((f: any) => f.properties) || [];

    setProperties(props);
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <main className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">
        Your Favorites ⭐
      </h1>

      {properties.length === 0 && (
        <p>No saved homes yet.</p>
      )}

      <div className="grid gap-4">
        {properties.map((p) => (
          <Link
            key={p.id}
            href={`/property/${p.id}`}
            className="border p-4 rounded hover:bg-gray-100"
          >
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}

            <h2 className="font-semibold">
              {p.title}
            </h2>

            <p>📍 {p.location}</p>
            <p>💰 ₦{p.price}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
