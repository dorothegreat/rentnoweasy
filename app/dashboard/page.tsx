"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Landlord Panel</h2>

      <div className="flex gap-4">
        <Link
          href="/add-listing"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block"
        >
          Add Property
        </Link>

        <button className="bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2 rounded hover:bg-slate-700">
          View My Listings
        </button>
      </div>
    </div>
  )
}

/* =========================
   TENANT UI
========================= */

function TenantUI() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tenant Panel</h2>

      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block"
        >
          Browse Properties
        </Link>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block">
          Saved Listings
        </button>
      </div>
    </div>
  )
}