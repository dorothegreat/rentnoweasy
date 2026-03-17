"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchCount = async () => {
    const { count, error } = await supabase
  .from("waiting_list")
  .select("id", { count: "exact", head: true });

if (!error) {
  setCount(count ?? 0);
}
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const joinWaitlist = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("waiting_list")
      .insert([{ email }]);

    if (error) {
      setError("You are already on the waitlist.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    fetchCount();
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white">

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

        {/* Hero Text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Apartments Without Agent Stress
          </h1>

          <p className="text-slate-400 mb-6">
            Rent directly from landlords. No inflated agent fees.
          </p>

          <p className="text-blue-400 font-semibold mb-6">
            🔥 {count}+ tenants already waiting
          </p>

          {success ? (
            <p className="text-green-400 font-semibold">
              🎉 You're on the waiting list!
            </p>
          ) : (
            <div className="flex gap-2">

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />

              <button
                onClick={joinWaitlist}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
              >
                {loading ? "Joining..." : "Join Waitlist"}
              </button>

            </div>
          )}

          {error && (
            <p className="text-red-400 mt-4">{error}</p>
          )}

        </div>

        {/* Hero Image */}
        <div>
          <img
            src="/hero-apartment.png"
            alt="Modern apartment"
            className="rounded-2xl shadow-lg"
          />
        </div>

      </section>

      {/* BENEFITS */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h3 className="font-semibold text-lg mb-2">
            No Agent Stress
          </h3>
          <p className="text-slate-400">
            Rent directly from landlords and avoid excessive agent fees.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h3 className="font-semibold text-lg mb-2">
            Verified Listings
          </h3>
          <p className="text-slate-400">
            Every property is verified to reduce scams and fake listings.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h3 className="font-semibold text-lg mb-2">
            Direct Landlord Contact
          </h3>
          <p className="text-slate-400">
            Unlock landlord contacts instantly and schedule inspections.
          </p>
        </div>

      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold text-center mb-12">
          What Tenants Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
            <p className="text-slate-300">
              "Finding apartments in Warri is stressful. I can't wait for this platform."
            </p>
            <p className="text-slate-500 mt-4">— Chinedu</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
            <p className="text-slate-300">
              "Agent fees are too high. Direct landlord contact is exactly what we need."
            </p>
            <p className="text-slate-500 mt-4">— Tolu</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
            <p className="text-slate-300">
              "If this works, it will change house hunting completely."
            </p>
            <p className="text-slate-500 mt-4">— Amaka</p>
          </div>

        </div>

      </section>

    </main>
  );
}
