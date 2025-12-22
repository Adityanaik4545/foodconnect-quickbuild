import { CheckCircle2, LogOut, Menu, Package, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useSession } from '@/lib/auth-client';


const ReceiverSideBar = () => {
    //   const [activeTab, setActiveTab] = useState('available');
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
            <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg text-slate-900">FoodConnect</h1>
                    <p className="text-xs text-slate-500">Receiver Portal</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 border border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md">
                        <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">Dashboard</p>
                        <p className="text-xs text-slate-500">Receiver Account</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
                <button
                    onClick={() => router.push("/dashboard/receiver_panel")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname === "/dashboard/receiver_panel"
                            ? "bg-emerald-500 text-white shadow-md"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                >
                    <Package className="w-5 h-5" />
                    Available Meals
                </button>
                <button
                    onClick={() => router.push("/dashboard/receiver_panel/accepted")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname.startsWith("/dashboard/receiver_panel/accepted")
                            ? "bg-emerald-500 text-white shadow-md"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                >
                    <CheckCircle2 className="w-5 h-5" />
                    My Accepted Meals
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium transition-all hover:bg-slate-100">
                    <Menu className="w-5 h-5" />
                    History
                </button>
                <button
                    onClick={() => router.push('/dashboard/receiver_panel/profile')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium transition-all hover:bg-slate-100"
                >
                    <User className="w-5 h-5" />
                    Profile
                </button>
            </nav>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-medium transition-all hover:bg-red-50 mt-auto border border-red-200"
            >
                <LogOut className="w-5 h-5" />
                Log Out
            </button>
        </div>
    </aside>
}

export default ReceiverSideBar
