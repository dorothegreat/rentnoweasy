"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function EditProperty({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");

  const loadProperty = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (!data) return;

    setTitle(data.title);
    setPrice(String(data.price));
    setLocation(data.location);
    setDescription(data.description);
    setContact(data.contact);
  };

  const updateProperty = async () => {
    await supabase
      .from("properties")
      .update({
        title,
        price: Number(price),
        location,
        description,
        contact,
      })
      .eq("id", id);

    alert("Property updated!");
    router.push("/dashboard");
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  return (
    <main className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">
        Edit Property
      </h1>

      <input
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <textarea
        className="border p-2 w-full"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <input
        className="border p-2 w-full"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />

      <button
        onClick={updateProperty}
        className="bg-black text-white p-2 w-full"
      >
        Save Changes
      </button>
    </main>
  );
}
