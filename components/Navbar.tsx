"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    loadUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          RentNowEasy
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">

          <Link href="/">Home</Link>

          {user && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/favorites">Favorites</Link>
              <Link href="/subscribe">Subscribe</Link>
            </>
          )}

          {!user ? (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Logout
            </button>
          )}

        </div>
      </nav>
    </header>
  );
}
