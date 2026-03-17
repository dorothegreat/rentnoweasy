"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string;
}

export default function LandlordListings() {
  const [properties, setProperties] = useState<Property[]>([]);

  const loadListings = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("landlord_id", userData.user.id);

    if (data) setProperties(data);
  };

  useEffect(() => {
    loadListings();
  }, []);

  const toggleStatus = async (property: Property) => {
    const newStatus =
      property.status === "available" ? "rented" : "available";

    await supabase
      .from("properties")
      .update({ status: newStatus })
      .eq("id", property.id);

    loadListings();
  };

  return (
    <div className="space-y-4">

      {properties.length === 0 && (
        <p className="text-slate-400">
          You haven't listed any properties yet.
        </p>
      )}

      {properties.map((property) => (
        <div
          key={property.id}
          className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-white">
              {property.title}
            </h3>

            <p className="text-slate-400 text-sm">
              {property.location}
            </p>

            <p className="text-green-400 font-semibold">
              ₦{property.price}
            </p>

            <p className="text-sm mt-1">
              Status:{" "}
              <span
                className={
                  property.status === "available"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {property.status}
              </span>
            </p>
          </div>

          <button
            onClick={() => toggleStatus(property)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Mark as {property.status === "available" ? "Rented" : "Available"}
          </button>
        </div>
      ))}
    </div>
  );
}
