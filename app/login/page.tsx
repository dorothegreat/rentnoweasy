"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "../components/PageWrapper";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login clicked"); // debug test

    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <PageWrapper>
      <main className="min-h-screen flex">

        {/* Left Panel */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white items-center justify-center p-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Welcome Back
            </h1>
            <p className="opacity-90">
              Manage your properties and track listings easily.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-slate-900 px-6">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md p-8 rounded-2xl shadow-lg">

            <h2 className="text-2xl font-bold mb-6 text-center text-slate-100">
              Login to Your Account
            </h2>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">
                {error}
              </p>
            )}

            {/* FORM ADDED */}
            <form onSubmit={handleLogin}>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
  onClick={() => console.log("Button clicked")}
  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
>
  Login
</button>


            </form>

            <p className="text-sm text-center mt-6 text-slate-400">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-500 font-semibold">
                Sign up
              </Link>
            </p>

          </div>
        </div>

      </main>
    </PageWrapper>
  );
}

