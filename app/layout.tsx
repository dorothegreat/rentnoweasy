import "./globals.css";
import Navbar from "@/components/Navbar";

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
      <body className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">

        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="flex-1">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-slate-900 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-8 text-center">
            <p className="font-semibold">RentNowEasy</p>
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}