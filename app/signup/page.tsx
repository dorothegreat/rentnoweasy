"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PageWrapper from "../components/PageWrapper"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function SignupPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("tenant")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            email: email,
            role: role,
          },
        ])

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }
    }

    if (role === "landlord") {
      router.push("dashboard")
    } else {
      router.push("dashboard")
    }
  }

  return (
    <PageWrapper>
      <main className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-slate-800 border border-slate-700 w-full max-w-md p-8 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold mb-6 text-center text-slate-100">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">

            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-xl"
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-xl"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-xl"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-xl"
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl
                         hover:bg-blue-700 active:scale-95 transition
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 font-semibold">
              Login
            </Link>
          </p>

        </div>
      </main>
    </PageWrapper>
  )
}
