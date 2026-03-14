"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  propertyId: string;
  phone?: string;
}

export default function UnlockContactButton({ propertyId, phone }: Props) {
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      return;
    }

    const res = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.user.email,
      }),
    });

    const data = await res.json();

    window.location.href = data.data.authorization_url;
  };

  const unlock = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (!subscription) {
      setLoading(false);
      startPayment();
      return;
    }

    setPhoneVisible(true);
    setLoading(false);
  };

  return (
    <div className="mt-6">
      {!phoneVisible ? (
        <button
          onClick={unlock}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Unlock Landlord Contact"}
        </button>
      ) : (
        <p className="text-lg font-semibold text-green-400">
          📞 {phone}
        </p>
      )}
    </div>
  );
}

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      return;
    }

    const res = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.user.email,
      }),
    });

    const data = await res.json();

    window.location.href = data.data.authorization_url;
  };

  const unlock = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    // check subscription
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    // 🚨 IF NO SUBSCRIPTION → PAYSTACK
    if (!subscription) {
      setLoading(false);
      startPayment();
      return;
    }

    // continue unlock logic here
    setPhoneVisible(true);
    setLoading(false);
  };

  return (
    <div className="mt-6">
      {!phoneVisible ? (
        <button
          onClick={unlock}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Processing..." : "Unlock Landlord Contact"}
        </button>
      ) : (
        <p className="text-lg font-semibold">
          📞 {phone}
        </p>
      )}
    </div>
  );
}