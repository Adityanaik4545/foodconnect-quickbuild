"use client";

import React, { useEffect, useState } from 'react';
import { Package, MapPin, CheckCircle2, LucideMessageCircleWarning, MessageCircleWarning, Clock } from 'lucide-react';
import { getAvailableDonations, acceptDonation } from '@/app/actions/donations';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/app/actions/getUserRole';

export default function ReceiverDashboard() {
  const [availableDonations, setAvailableDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleCheck, setRoleCheck] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkRoleAndLoad();
    const interval = setInterval(() => {
      loadData();
    }, 30_000); // every 1 minute

    return () => clearInterval(interval);
  }, []);

  const checkRoleAndLoad = async () => {
    try {
      const role = await getUserRole();
      if (role !== 'receiver') {
        if (role === 'donor') {
          router.push('/dashboard/donor_panel');
          return;
        } else {
          router.push('/role');
          return;
        }
      }
      setRoleCheck(false);
      await loadData();
    } catch (error) {
      console.error('Error checking role:', error);
      router.push('/role');
    }
  };

  const loadData = async () => {
    try {
      const available = await getAvailableDonations();
      setAvailableDonations(available);
      console.log(available);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDonation = async (donationId) => {
    try {
      await acceptDonation(donationId);
      router.push("/dashboard/receiver_panel/accepted");
      alert('Donation accepted successfully!');
    } catch (error) {
      alert(error.message || 'Failed to accept donation');
    }
  };



  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
  };

  if (loading || roleCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading available meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      {/* Main Container */}
      <div className="flex min-h-screen">
        {/* Sidebar */}


        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Available Meals
              </h1>
            </div>

            {/* Donations List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-6">
                {
                  availableDonations.length > 0 ? (
                    <div className="space-y-4">
                      {availableDonations.map((donation) => (
                        <div
                          key={donation.donationId}
                          className="
      relative overflow-hidden
      rounded-2xl border border-orange-200
      bg-white
      shadow-sm hover:shadow-lg
      transition-all
    "
                        >
                          {/* subtle background glow */}
                          <div className="absolute inset-0 bg-linear-to-br from-orange-50/40 via-transparent to-transparent pointer-events-none" />

                          <div className="relative p-6 flex items-start justify-between gap-6">
                            {/* LEFT CONTENT */}
                            <div className="flex gap-4 flex-1 min-w-0">
                              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-inner">
                                <Package className="w-7 h-7 text-orange-600" />
                              </div>

                              <div className="min-w-0">
                                <h3 className="text-lg font-bold text-slate-900">
                                  {donation.mealName}
                                </h3>

                                <p className="text-sm text-slate-500 mb-3">
                                  Listed by <span className="font-medium">{donation.donorName}</span>
                                </p>

                                <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                                  <span className="flex items-center gap-1 text-slate-600">
                                    <Package className="w-4 h-4" />
                                    Qty {donation.quantity}
                                  </span>

                                  {donation.type && (
                                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                                      {donation.type}
                                    </span>
                                  )}

                                  {donation.category && (
                                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                                      {donation.category}
                                    </span>
                                  )}
                                </div>

                                {donation.address && (
                                  <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    <span className="truncate">{donation.address}</span>
                                  </div>
                                )}

                                <div className="flex items-center gap-3">
                                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Available
                                  </span>

                                  <span className="text-xs text-slate-500">
                                    Listed on {formatDate(donation.createdAt)}
                                  </span>

                                  <div className="flex items-center gap-1 text-xs text-slate-500">
                                    {donation.preparedTime ? (
                                      <div className='flex gap-2'>
                                        <Clock className="w-4 h-4" />
                                        Prepared on {formatDateTime(donation.preparedTime)}
                                      </div>
                                    ) : (
                                      <div className='flex gap-2 items-center'>
                                        <MessageCircleWarning className="w-4 h-4" />
                                        {donation.category === "raw" ? (
                                          <div>
                                            Use before {formatDateTime(donation.expiresAt)}
                                          </div>
                                        ) : (
                                          <div>
                                            Expires on {formatDateTime(donation.expiresAt)}
                                          </div>
                                        )
                                        }
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* RIGHT ACTION */}
                            <div className="flex flex-col items-end gap-4">
                              <button
                                onClick={() => handleAcceptDonation(donation.donationId)}
                                className="
            flex items-center gap-2
            px-7 py-3
            rounded-full
            bg-linear-to-r from-orange-500 to-amber-400
            text-white font-semibold
            shadow-lg shadow-orange-300/40
            hover:scale-[1.03]
            transition-all
            whitespace-nowrap
          "
                              >
                                <CheckCircle2 className="w-5 h-5" />
                                Accept
                              </button>

                              {/* <span className="flex items-center gap-1 text-sm text-orange-600">
          <MapPin className="w-4 h-4" />
          1.5 km away
        </span> */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-20">
                      <div className="
    relative
    w-full max-w-xl
    rounded-3xl
    bg-white/80 backdrop-blur-md
    border border-orange-100
    shadow-[0_20px_60px_-15px_rgba(251,146,60,0.35)]
    px-10 py-16
    text-center
  ">
                        {/* Glow / decoration */}
                        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-orange-100/40 via-transparent to-orange-200/30 pointer-events-none" />

                        {/* Icon bubble */}
                        <div className="
      relative
      mx-auto mb-6
      w-20 h-20
      rounded-full
      bg-linear-to-br from-orange-400 to-amber-400
      flex items-center justify-center
      shadow-lg shadow-orange-300/40
      animate-[float_6s_ease-in-out_infinite]

    ">
                          <Package className="w-10 h-10 text-white" />
                        </div>

                        {/* Text */}
                        <h3 className="relative text-xl font-semibold text-slate-900 mb-2">
                          No meals available yet
                        </h3>
                        <p className="relative text-slate-600 max-w-sm mx-auto">
                          Once donors add food, it will appear here.
                        </p>
                      </div>
                    </div>

                  )
                }
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
