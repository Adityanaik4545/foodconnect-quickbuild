"use client";

import { ArrowBigLeft, ArrowLeft, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <div className="flex flex-col gap-8">
      <Button onClick={() => router.push("/admin/dashboard")} variant="outline" size="icon" className="rounded-full w-15 h-12">
        <ArrowBigLeft />
      </Button>
    </div>

          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Admin Panel
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
