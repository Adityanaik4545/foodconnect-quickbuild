"use client";

import React, { useEffect, useState } from 'react';
import { Home, Menu, User, Calendar, Package, Plus, LogOut, TrendingUp, Clock, MapPin, CheckCircle2, Users } from 'lucide-react';
import { getDonorDonations } from '@/app/actions/donations';
import { signOut, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import ListFoodForm from '../../../../components/ListFoodForm';
import { getUserRole } from '@/app/actions/getUserRole';
import Image from 'next/image';

export default function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showListFoodForm, setShowListFoodForm] = useState(false);
  const [roleCheck, setRoleCheck] = useState(true);
  const router = useRouter()


  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    checkRoleAndLoad();
  }, []);

  const checkRoleAndLoad = async () => {
    try {
      const role = await getUserRole();
      if (role !== 'donor') {
        if (role === 'receiver') {
          router.push('/dashboard/receiver_panel');
          return;
        } else {
          router.push('/role');
          return;
        }
      }
      setRoleCheck(false);
      await loadDonations();
    } catch (error) {
      console.error('Error checking role:', error);
      router.push('/role');
    }
  };

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

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }; 1

  // Calculate stats
  const totalDonations = donations.length;
  const availableCount = donations.filter(d => d.status === 'available').length;
  const completedCount = donations.filter(d => d.status === 'completed').length;
  const recentDonations = donations.slice(0, 2);
  const availableDonations = donations.filter(d => d.status === 'available');
  const allRecentDonations = donations.slice(0, 6);

  if (loading || roleCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your donations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="
    relative overflow-hidden rounded-3xl p-8 mb-10
    bg-cover bg-center
  "
          style={{
            backgroundImage: "url('/assets/image/ChatGPT Image Dec 22, 2025, 12_52_13 AM.png')",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-emerald-800/40 to-transparent" />

          {/* Content */}
          <div className="relative z-10 max-w-xl text-white">
            <h1 className="text-3xl font-bold mb-2">
              👋 Hi {user?.name || "there"}
            </h1>

            <p className="text-lg mb-6">
              Ready to share food today?
            </p>

            <button
              onClick={() => setShowListFoodForm(true)}
              className="
        inline-flex items-center gap-2
        px-6 py-3 rounded-full
        bg-gradient-to-r from-emerald-600 to-emerald-400
        text-white font-medium
        shadow-lg shadow-emerald-500/40
        hover:from-emerald-700 hover:to-emerald-500
        transition-all duration-300
      "
            >
              + Share Food Now
            </button>
          </div>
          <div className=" mt-20 relative z-20">
            <div className="
    bg-white/90 backdrop-blur
    rounded-2xl
    shadow-lg shadow-slate-200/60
    border border-slate-200
    grid grid-cols-1 md:grid-cols-3
    divide-y md:divide-y-0 md:divide-x
  ">

              {/* Meals Shared */}
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {totalDonations}
                  </p>
                  <p className="text-sm text-slate-600">
                    Meals Shared
                  </p>
                </div>
              </div>

              {/* People Helped */}
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {completedCount}
                  </p>
                  <p className="text-sm text-slate-600">
                    People Helped
                  </p>
                </div>
              </div>

              {/* Active Listings */}
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {availableCount}
                  </p>
                  <p className="text-sm text-slate-600">
                    Active Listings
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>




        {/* Stats Grid */}
        {/* Impact Stats – Attached to Hero */}

        {/* Recent Donations Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm mb-12 overflow-hidden">

          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Donations</h2>
              <p className="text-sm text-slate-500">
                Track and manage your shared meals
              </p>
            </div>

          </div>

          {/* Content */}
          <div className="p-6">
            {allRecentDonations.length > 0 ? (
              <div className="space-y-4">
                {allRecentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="
              group rounded-2xl p-5
              bg-slate-50/60 hover:bg-white
              border border-slate-200 hover:border-emerald-300
              hover:shadow-md transition-all
            "
                  >
                    <div className="flex gap-4">

                      {/* Icon */}
                      <div
                        className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                  ${donation.status === "available"
                            ? "bg-emerald-100 text-emerald-600"
                            : donation.status === "completed"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-orange-100 text-orange-600"
                          }
                `}
                      >
                        <Package className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 text-base">
                              {donation.mealName}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {formatDate(donation.createdAt)} · Qty {donation.quantity}
                            </p>
                          </div>

                          {/* Status pill */}
                          <span
                            className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${donation.status === "available"
                                ? "bg-emerald-100 text-emerald-700"
                                : donation.status === "completed"
                                  ? "bg-slate-100 text-slate-700"
                                  : "bg-orange-100 text-orange-700"
                              }
                    `}
                          >
                            {donation.status}
                          </span>
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          {donation.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate max-w-xs">
                                {donation.address}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Prepared {formatDateTime(donation.preparedTime)}
                          </div>

                          {(donation.type || donation.category) && (
                            <span>
                              {donation.type || "N/A"} · {donation.category || "N/A"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-emerald-600" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Your first donation can help someone today 🌱
                </h3>
                <p className="text-slate-600 max-w-md mx-auto mb-6">
                  Food waste becomes hope when shared. Listing food takes less than a
                  minute.
                </p>

                <button
                  onClick={() => setShowListFoodForm(true)}
                  className="
            inline-flex items-center gap-2 px-7 py-3
            bg-gradient-to-r from-emerald-500 to-emerald-400
            text-white rounded-full font-semibold
            hover:from-emerald-600 hover:to-emerald-500
            shadow-lg shadow-emerald-500/30
            transition-all
          "
                >
                  <Plus className="w-5 h-5" />
                  Share Your First Meal
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
      {showListFoodForm && (
        <ListFoodForm
          onClose={() => {
            setShowListFoodForm(false);
            loadDonations();
          }}
        />
      )}
    </>
  );
}
