"use client";

import React, { useEffect, useState } from 'react';
import { Home, Menu, User, Package, LogOut, MapPin, Clock, CheckCircle2, Search, Filter } from 'lucide-react';
import { getAvailableDonations, acceptDonation, getReceiverAcceptedDonations } from '@/app/actions/donations';
import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/app/actions/getUserRole';

export default function ReceiverDashboard() {
  const [availableDonations, setAvailableDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [roleCheck, setRoleCheck] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkRoleAndLoad();
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
      const [available, accepted] = await Promise.all([
        getAvailableDonations(),
        getReceiverAcceptedDonations(),
      ]);
      setAvailableDonations(available);
      setAcceptedDonations(accepted);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDonation = async (donationId) => {
    try {
      await acceptDonation(donationId);
      await loadData();
      alert('Donation accepted successfully!');
    } catch (error) {
      alert(error.message || 'Failed to accept donation');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading available meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Main Container */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-200 shadow-sm flex flex-col">
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
                onClick={() => setActiveTab('available')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'available'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Package className="w-5 h-5" />
                Available Meals
              </button>
              <button 
                onClick={() => setActiveTab('accepted')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'accepted'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
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

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {activeTab === 'available' ? 'Available Meals' : 'My Accepted Meals'}
              </h1>
              <p className="text-slate-600">
                {activeTab === 'available' 
                  ? 'Browse and accept available food donations' 
                  : 'Track your accepted meal donations'}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-600">Available</h3>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-slate-900">{availableDonations.length}</p>
                <p className="text-xs text-slate-500 mt-2">Meals ready to accept</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-600">Accepted</h3>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-slate-900">{acceptedDonations.length}</p>
                <p className="text-xs text-slate-500 mt-2">Meals you've accepted</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-600">Total</h3>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-slate-600" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-slate-900">{availableDonations.length + acceptedDonations.length}</p>
                <p className="text-xs text-slate-500 mt-2">All meals</p>
              </div>
            </div>

            {/* Donations List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-6">
                {activeTab === 'available' ? (
                  availableDonations.length > 0 ? (
                    <div className="space-y-4">
                      {availableDonations.map((donation) => (
                        <div 
                          key={donation.donationId} 
                          className="p-6 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                                  <Package className="w-7 h-7 text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-xl font-bold text-slate-900 mb-1">{donation.mealName}</h3>
                                  <p className="text-sm text-slate-600 mb-3">
                                    Donated by <span className="font-medium">{donation.donorName}</span>
                                  </p>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
                                    <div className="flex items-center gap-1.5">
                                      <Package className="w-4 h-4" />
                                      <span>Quantity: {donation.quantity}</span>
                                    </div>
                                    {donation.type && (
                                      <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium">
                                        {donation.type}
                                      </span>
                                    )}
                                    {donation.category && (
                                      <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium">
                                        {donation.category}
                                      </span>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="w-4 h-4" />
                                      <span>{formatDateTime(donation.preparedTime)}</span>
                                    </div>
                                  </div>
                                  {donation.address && (
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-3">
                                      <MapPin className="w-4 h-4" />
                                      <span className="truncate">{donation.address}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                      Available
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      Listed {formatDate(donation.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAcceptDonation(donation.donationId)}
                              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold transition-all hover:bg-emerald-600 shadow-md hover:shadow-lg whitespace-nowrap"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                              Accept
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">No meals available yet</h3>
                      <p className="text-slate-600">Once donors add food, it will appear here.</p>
                    </div>
                  )
                ) : (
                  acceptedDonations.length > 0 ? (
                    <div className="space-y-4">
                      {acceptedDonations.map((donation) => (
                        <div 
                          key={donation.acceptedId} 
                          className="p-6 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-slate-900 mb-1">{donation.mealName}</h3>
                              <p className="text-sm text-slate-600 mb-4">
                                Donated by <span className="font-medium">{donation.donorName || 'Anonymous'}</span>
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                                <div className="flex items-center gap-1.5">
                                  <Package className="w-4 h-4" />
                                  <span>Qty: {donation.quantity}</span>
                                </div>
                                {donation.type && (
                                  <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium">
                                    {donation.type}
                                  </span>
                                )}
                                {donation.category && (
                                  <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-medium">
                                    {donation.category}
                                  </span>
                                )}
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatDateTime(donation.preparedTime)}</span>
                                </div>
                              </div>
                              {donation.address && (
                                <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-4">
                                  <MapPin className="w-4 h-4" />
                                  <span className="truncate">{donation.address}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  donation.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 
                                  donation.status === 'picked' ? 'bg-emerald-100 text-emerald-700' : 
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {donation.status}
                                </span>
                                <span className="text-xs text-slate-500">
                                  Accepted: {formatDateTime(donation.acceptedAt)}
                                </span>
                                {donation.pickedAt && (
                                  <span className="text-xs text-slate-500">
                                    Picked: {formatDateTime(donation.pickedAt)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">No accepted meals yet</h3>
                      <p className="text-slate-600">Accept meals from the Available Meals tab to see them here.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
