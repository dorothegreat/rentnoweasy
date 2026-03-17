"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  propertyId: string;
  landlordPhone?: string;
}

export default function UnlockContactButton({
  propertyId,
  landlordPhone,
}: Props) {
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    try {
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

      if (!res.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      window.location.href = data.data.authorization_url;
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const unlock = async () => {
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      /* -----------------------------------------
      Check if this property was already unlocked
      ----------------------------------------- */

      const { data: existingUnlock } = await supabase
        .from("contact_unlocks")
        .select("*")
        .eq("user_id", userId)
        .eq("property_id", propertyId)
        .maybeSingle();

      if (existingUnlock) {
        setPhoneVisible(true);
        setLoading(false);
        return;
      }

      /* -----------------------------------------
      Get subscription
      ----------------------------------------- */

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("unlocks_remaining")
        .eq("user_id", userId)
        .maybeSingle();

      if (!subscription || subscription.unlocks_remaining <= 0) {
        setLoading(false);
        startPayment();
        return;
      }

      /* -----------------------------------------
      Deduct one unlock
      ----------------------------------------- */

      const remaining = subscription.unlocks_remaining - 1;

      await supabase
        .from("subscriptions")
        .update({
          unlocks_remaining: remaining,
        })
        .eq("user_id", userId);

      /* -----------------------------------------
      Save unlock record
      ----------------------------------------- */

      await supabase.from("contact_unlocks").insert({
        user_id: userId,
        property_id: propertyId,
      });

      setPhoneVisible(true);
    } catch (error) {
      console.error(error);
      alert("Failed to unlock contact");
    }

    setLoading(false);
  };

  return (
    <div className="mt-6">

      {phoneVisible ? (
        <p className="text-lg font-semibold text-green-400">
          📞 {landlordPhone}
        </p>
      ) : (
        <button
          onClick={unlock}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition"
        >
          {loading ? "Processing..." : "Unlock Landlord Contact"}
        </button>
      )}

    </div>
  );
}
