"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import LandlordListings from "@/components/LandlordListings";

export default function DashboardPage() {
  const router = useRouter()

  const [role, setRole] = useState<string>("tenant")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      // Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // If not logged in → redirect
      if (!user) {
        router.push("/signup")
        return
      }

      // Fetch role from profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error(error.message)
      } else if (data) {
        setRole(data.role)
      }

      setLoading(false)
    }

    getProfile()
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading dashboard...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {role === "landlord" && <LandlordUI />}
      {role === "tenant" && <TenantUI />}
    </main>
  )
}

/* =========================
   LANDLORD UI
========================= */
function LandlordUI() {
  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold">Landlord Panel</h2>

      <div className="flex gap-4">
        <Link
          href="/add-listing"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Property
        </Link>
      </div>

      <LandlordListings />

    </div>
  )
}

/* =========================
   TENANT UI
========================= */

function TenantUI() {
  const [remainingUnlocks, setRemainingUnlocks] = useState<number | null>(null)
  const [unlockHistory, setUnlockHistory] = useState<any[]>([])

  useEffect(() => {
    const loadTenantData = async () => {

      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) return

      const userId = userData.user.id

      /* ------------------------------
      Load Remaining Credits
      ------------------------------ */

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("unlocks_remaining")
        .eq("user_id", userId)
        .maybeSingle()

      if (subscription) {
        setRemainingUnlocks(subscription.unlocks_remaining)
      } else {
        setRemainingUnlocks(0)
      }

      /* ------------------------------
      Load Unlock History
      ------------------------------ */

      const { data: history } = await supabase
        .from("contact_unlocks")
        .select(`
          id,
          created_at,
          properties (
            id,
            title,
            location
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (history) {
        setUnlockHistory(history)
      }
    }

    loadTenantData()
  }, [])

  return (
    <div className="space-y-8">

      <h2 className="text-xl font-semibold">Tenant Panel</h2>

      {/* Remaining Credits Card */}

      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
        <p className="text-slate-400 text-sm">Remaining Unlock Credits</p>

        <p className="text-3xl font-bold text-green-400">
          {remainingUnlocks === null ? "Loading..." : remainingUnlocks}
        </p>

        <p className="text-xs text-slate-500 mt-1">
          Each contact unlock uses 1 credit
        </p>
      </div>


      {/* Unlock History */}

      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">

        <h3 className="text-lg font-semibold mb-4">
          Unlocked Contacts
        </h3>

        {unlockHistory.length === 0 ? (

          <p className="text-slate-400 text-sm">
            No contacts unlocked yet
          </p>

        ) : (

          <div className="space-y-3">

            {unlockHistory.map((item) => (

              <Link
                key={item.id}
                href={`/property/$ {item.properties?.id}`}
                className="block p-3 rounded-lg border border-slate-700 hover:bg-slate-700 transition"
              >

                <p className="font-medium">
                  {item.properties?.title}
                </p>

                <p className="text-sm text-slate-400">
                  {item.properties?.location}
                </p>

              </Link>

            ))}

          </div>

        )}

      </div>


      {/* Navigation */}

      <div className="flex gap-4">

        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block"
        >
          Browse Properties
        </Link>

        <button className="bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2 rounded hover:bg-slate-700">
          Saved Listings
        </button>

      </div>

    </div>
  );
}