import "./globals.css";
import Link from "next/link";
import Logo from "./components/Logo";
import { Home, LayoutDashboard, LogIn, UserPlus } from "lucide-react";

export const metadata = {
  title: "RentNowEasy",
  description: "Property rental platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex flex-col">

        {/* NAVBAR */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
             <Logo />
            </Link>

            <nav className="flex gap-6 items-center">

  <Link
    href="/"
    className="flex items-center gap-2 hover:text-blue-600 transition"
  >
    <Home size={18} />
    Home
  </Link>

  <Link
    href="/dashboard"
    className="flex items-center gap-2 hover:text-blue-600 transition"
  >
    <LayoutDashboard size={18} />
    Dashboard
  </Link>

  <Link
    href="/login"
    className="flex items-center gap-2 hover:text-blue-600 transition"
  >
    <LogIn size={18} />
    Login
  </Link>

  <Link
    href="/signup"
    className="flex items-center gap-2 hover:text-blue-600 transition"
  >
    <UserPlus size={18} />
    Sign Up
  </Link>

</nav>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t">
          <div className="max-w-6xl mx-auto px-6 py-8 text-center">
            <p className="font-semibold">RentNowEasy</p>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
