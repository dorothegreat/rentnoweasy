"use client";

import PageWrapper from "../components/PageWrapper";
import Link from "next/link";

export default function LoginPage() {
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
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6">
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

            <h2 className="text-2xl font-bold mb-6 text-center">
              Login to Your Account
            </h2>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
                Login
              </button>
            </div>

            <p className="text-sm text-center mt-6">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-600 font-semibold">
                Sign up
              </Link>
            </p>

          </div>
        </div>

      </main>
    </PageWrapper>
  );
}