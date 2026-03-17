"use client";

import Link from "next/link";
import Logo from "@/app/components/Logo";
import { Home, LayoutDashboard, LogIn, UserPlus, Menu, X, PlusSquare, List } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/signup";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (hideNavbar) return null;

  return (
    <>
      {/* Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          <Link href="/" className="text-xl font-bold">
            <Logo />
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded hover:bg-slate-800"
          >
            <Menu size={24} />
          </button>

        </div>
      </header>

      {/* Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 flex">

          {/* Overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Menu */}
          <div className="w-64 bg-slate-900 border-l border-slate-800 shadow-lg p-6 flex flex-col gap-6 text-slate-200">

            <button
              onClick={() => setOpen(false)}
              className="self-end"
            >
              <X size={24} />
            </button>

            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <Home size={18} />
              Home
            </Link>

            {user && (
  <>
    <Link
      href="/dashboard"
      className="flex items-center gap-2"
      onClick={() => setOpen(false)}
    >
      <LayoutDashboard size={18} />
      Dashboard
    </Link>

    <Link
      href="/add-property"
      className="flex items-center gap-2"
      onClick={() => setOpen(false)}
    >
      <PlusSquare size={18} />
      Post Property
    </Link>

    <Link
      href="/my-listings"
      className="flex items-center gap-2"
      onClick={() => setOpen(false)}
    >
      <List size={18} />
      My Listings
    </Link>
  </>
)}

            {!user ? (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <LogIn size={18} />
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <UserPlus size={18} />
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-left hover:text-red-400"
              >
                Logout
              </button>
            )}

          </div>
        </div>
      )}
    </>
  );
}
