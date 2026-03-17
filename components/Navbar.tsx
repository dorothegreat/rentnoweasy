"use client";

import Link from "next/link";
import Logo from "@/app/components/Logo";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/signup";

  if (hideNavbar) return null;

  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-3 items-center">

        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Center: Brand Text */}
<div className="text-center">
  <Link
    href="/"
    className="relative text-xl font-bold text-white tracking-wide
               after:absolute after:left-0 after:-bottom-1
               after:h-[2px] after:w-0 after:bg-blue-500
               after:transition-all after:duration-300
               hover:after:w-full"
  >
    RentNowEasy
  </Link>
</div>


        {/* Right side intentionally empty to keep center alignment */}
        <div />

      </div>
    </header>
  );
}
