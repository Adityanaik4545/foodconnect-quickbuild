"use client";
import Image from "next/image";
import { Home, Menu, User, Calendar, Package, Plus, LogOut, TrendingUp, Clock, MapPin, CheckCircle2, HomeIcon } from 'lucide-react';
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import ListFoodForm from "@/components/ListFoodForm";
import { getDonorDonations } from "@/app/actions/donations";
import DonorSideBar from "@/components/DonorSideBar";
import ReceiverSideBar from "@/components/ReceiverSideBar";


export default function DashboardLayout({ children }) {
    const pathname = usePathname();

  const isDonor = pathname.startsWith("/dashboard/donor_panel");
  const isReceiver = pathname.startsWith("/dashboard/receiver_panel");

  const [showListFoodForm, setShowListFoodForm] = useState(false);
    const [donations, setDonations] = useState([]);
      const [loading, setLoading] = useState(true);

    const loadDonations = async () => {
      try {
        const data = await getDonorDonations();
        setDonations(data);
      } catch (error) {
        console.error('Error loading donations:', error);
      } finally {
        setLoading(false);
      }
    };


  

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="flex h-full">
        {isDonor && <DonorSideBar />}
        {isReceiver && <ReceiverSideBar/>}

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
        {isDonor && (
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
        )}
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
