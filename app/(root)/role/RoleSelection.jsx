"use client"
import React, { useState } from 'react';
import { Apple, Salad, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveUserRole } from '@/app/actions/saveUserRole';
import Image from 'next/image';

export default function RoleSelection() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async(role) => {
    setSelectedRole(role);
    setLoading(true);

    try {
      await saveUserRole(role); 
      if (role === "donor") {
        router.push("/dashboard/donor_panel");
      } else {
        router.push("/dashboard/receiver_panel");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      alert(error.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br  from-slate-50 via-white to-slate-50 flex  justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-25">
          <div className="inline-flex items-center justify-center rounded-2xl shadow-lg mb-6">
            <Image src="/assets/logo/foodconnect_main.png" width={300} height={200} alt='logo' />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mt-20">Why are you here?</h1>
          <p className="text-xl text-slate-600"></p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Donor Card */}
          <button
            onClick={() => handleRoleSelect('donor')}
            disabled={loading}
            className="group relative bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-emerald-500 transition-all hover:shadow-xl text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Image src="/assets/icons/donate-icon.png"height={60} width={60} alt='logo'/>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Share Food</h2>
              <p className="text-slate-600 mb-6">
                Share your surplus food with those in need. Make a difference in your community.
              </p>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-3 transition-all">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* Receiver Card */}
          <button
            onClick={() => handleRoleSelect('receiver')}
            disabled={loading}
            className="group relative bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-orange-500 transition-all hover:shadow-xl text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Image src="/assets/icons/searching.png"height={60} width={60} alt='icon' />

              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Find Food</h2>
              <p className="text-slate-600 mb-6">
                Find and accept available meals from generous donors in your area.
              </p>
              <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>

        {/* Tagline */}
        <p className="text-center text-slate-500 text-lg">
          Connect and share a meal. Together we can reduce food waste.
        </p>

        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-900 font-medium">Setting up your account...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
