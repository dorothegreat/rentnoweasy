"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SubscribePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load logged-in user
  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Auth error:", error);
      }

      setUser(data.user);
      setLoading(false);
    };

    loadUser();
  }, []);

  const startPayment = async () => {
    try {
      if (!user) {
        alert("Please login first");
        return;
      }

      const email = user.email || "test@example.com";

      console.log("Starting payment with:", {
        email,
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      });

      if (!process.env.NEXT_PUBLIC_PAYSTACK_KEY) {
        alert("Missing Paystack key");
        return;
      }

      // Browser-only import
      const PaystackPop = (await import("@paystack/inline-js")).default;

      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
        email: email,
        amount: 500000, // ₦5,000 in kobo
        currency: "NGN",

        callback: async () => {
          try {
            const res = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: user.id,
              }),
            });

            const data = await res.json();
            console.log("Verify response:", data);

            alert("Subscription activated!");
            window.location.href = "/";
          } catch (err) {
            console.error("Verification error:", err);
            alert("Verification failed — check console");
          }
        },

        onCancel: () => {
          alert("Payment cancelled");
        },
      });
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed — check console");
    }
  };

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <main className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">
        Subscribe to Unlock Contacts
      </h1>

      {!user ? (
        <p>Please login to continue.</p>
      ) : (
        <>
          <p>
            Pay ₦5,000 monthly to view landlord contacts.
          </p>

          <button
            onClick={startPayment}
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Subscribe Now
          </button>
        </>
      )}
    </main>
  );
}
