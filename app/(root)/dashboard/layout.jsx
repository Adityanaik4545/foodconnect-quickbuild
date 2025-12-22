"use client"
import { navItemClass } from "@/lib/utils";
import Image from "next/image";
import { Home, Menu, User, Calendar, Package, Plus, LogOut, TrendingUp, Clock, MapPin, CheckCircle2, HomeIcon } from 'lucide-react';
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from "react";
import ListFoodForm from "@/components/ListFoodForm";


export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showListFoodForm, setShowListFoodForm] = useState(false);


  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="flex h-full">

        <aside className="w-72 bg-white border-r border-slate-200 shadow-sm flex flex-col">
          <div className="p-6 space-y-6">
            {/* Logo/Brand */}
            <div className='mt-auto p-2 space-y-4 border-b border-slate-200'>
              <Image src="/assets/logo/foodconnect_main.png" width={200} height={200} alt='logo' />
            </div>


            {/* Profile Card */}
            {/* <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Dashboard</p>
                  <p className="text-xs text-slate-500">Donor Account</p>
                </div>
              </div>
            </div> */}

            {/* Navigation */}
            <nav className="space-y-2">
              <button
                onClick={() => router.push("/dashboard/donor_panel")}
                className={navItemClass(pathname === "/dashboard/donor_panel")}>
                <HomeIcon className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={() => router.push("/dashboard/donor_panel/my-food")}
                className={navItemClass(pathname.startsWith("/dashboard/donor_panel/my-food"))}>
                <Menu className="w-5 h-5" />
                My food
              </button>
              <button
                onClick={() => router.push('/dashboard/donor_panel/nearby')}
                className={navItemClass(pathname.startsWith("/dashboard/donor_panel/nearby"))}
              >
                <User className="w-5 h-5" />
                Nearby Request
              </button>
            </nav>
          </div>
          {/* Logout Button */}
          <div className='mt-auto p-6 space-y-4 border-t border-slate-200'>
            <div className="mt-auto">
              {!user ? (
                <Skeleton className="h-12 w-full rounded-full bg-green-300" />
              ) : (

                <button
                  onClick={() => router.push("/dashboard/donor_panel/profile")}
                  className="
                w-full flex items-center gap-3
                border border-emerald-100
                cursor-pointer
                rounded-full bg-emerald-50 px-4 py-3
                hover:bg-emerald-100 transition-colors
               "
                >
                  {/* Avatar */}
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-black text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "!"}
                  </div>

                  {/* Name + Email */}
                  <div className="flex flex-col text-left leading-tight overflow-hidden">
                    <span className="text-sm font-semibold text-slate-800">
                      {user?.name || "Set your Profile"}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </span>
                  </div>
                </button>
              )}
            </div>
            {/* <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-medium transition-all hover:bg-red-50 mt-auto border border-red-200"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button> */}
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
        <button
          onClick={() => setShowListFoodForm(true)}

          className="
        fixed bottom-6 right-20 z-50
        flex items-center gap-2
        rounded-full px-6 py-2
        bg-gradient-to-r from-emerald-600 to-emerald-400
        text-white font-medium
        shadow-lg shadow-emerald-500/40
        hover:from-emerald-700 hover:to-emerald-500
        transition-all duration-300
      "
        >
          <span className="text-xl">+</span>
          List Food
        </button>
      </div>
                {showListFoodForm && (
            <ListFoodForm
              onClose={() => {
                setShowListFoodForm(false);
                loadDonations();
              }}
            />
          )}
    </div>
  );
}
