import { CheckCircle2, LogOut, Menu, Package, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useSession } from '@/lib/auth-client';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';


const ReceiverSideBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const user = session?.user;
    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return <aside className="w-72 bg-white border-r border-slate-200 shadow-sm flex flex-col">
        <div className="p-6 space-y-6">
            {/* Logo/Brand */}
            <div className='mt-auto space-y-4 border-b border-slate-200'>
                <Image src="/assets/logo/orange_primary.png" width={200} height={200} alt='logo' />
            </div>


            {/* Navigation Tabs */}
            <nav className="space-y-2">
                <button
                    onClick={() => router.push("/dashboard/receiver_panel")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300
                    ${pathname === "/dashboard/receiver_panel"
                            ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-amber-500 hover:shadow-orange-500/40 active:scale-[0.98]"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}

                >
                    <span className="absolute inset-0 bg-white/10 pointer-events-none" />

                    <Package className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Available Meals</span>
                </button>
                <button
                    onClick={() => router.push("/dashboard/receiver_panel/accepted")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300
                    ${pathname === "/dashboard/receiver_panel/accepted"
                            ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-amber-500 hover:shadow-orange-500/40 active:scale-[0.98]"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                >
                    <span className="absolute inset-0 bg-white/10 pointer-events-none" />

                    <CheckCircle2 className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">My Accepted Meals</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-semibold transition-all hover:bg-slate-100">
                    <span className="absolute inset-0 bg-white/10 pointer-events-none" />

                    <CheckCircle2 className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">History</span>
                </button>
            </nav>
        </div>

        <div className='mt-auto p-6 space-y-4 border-t border-slate-200'>
<div className="mt-auto">
  {!user ? (
    <Skeleton className="h-12 w-full rounded-full bg-orange-200" />
  ) : (
    <button
      onClick={() => router.push("/dashboard/receiver_panel/profile")}
      className="
        w-full flex items-center gap-3
        border border-orange-200
        cursor-pointer
        rounded-full bg-orange-50 px-4 py-3
        hover:bg-orange-100
        transition-colors duration-300
      "
    >
      {/* Avatar */}
      <div className="
        h-10 w-_toggle w-10
        flex items-center justify-center
        rounded-full
        bg-gradient-to-br from-orange-500 to-amber-500
        text-white font-semibold
        shadow-sm
      ">
        {user?.name?.charAt(0).toUpperCase() || "!"}
      </div>

      {/* Name + Email */}
      <div className="flex flex-col text-left leading-tight overflow-hidden">
        <span className="text-sm font-semibold text-slate-800">
          {user?.name || "Complete your profile"}
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
}

export default ReceiverSideBar
