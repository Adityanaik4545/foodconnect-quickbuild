"use client";

import AdminGuard from '../../../../components/AdminGuard'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { getAdminStats } from '@/app/actions/adminStats'
import { Users, Heart, ShoppingBag, CheckCircle2, TrendingUp, Activity } from 'lucide-react'

const page = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalReceivers: 0,
    totalDonations: 0,
    activeDonations: 0,
    completedDonations: 0,
    acceptedDonations: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getAdminStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600',
      orange: 'bg-orange-50 border-orange-200 text-orange-600',
      red: 'bg-red-50 border-red-200 text-red-600',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    }

    return (
      <div className={`${colorClasses[color]} border rounded-lg p-4 flex items-start gap-4`}>
        <div className={`p-3 rounded-lg ${colorClasses[color].split(' ')[0]}`}>
          <Icon size={24} className={colorClasses[color].split(' ')[2]} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600">Manage your platform and monitor activities</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            color="blue"
          />
          <StatCard
            icon={Heart}
            label="Total Donors"
            value={stats.totalDonors}
            color="green"
          />
          <StatCard
            icon={ShoppingBag}
            label="Total Receivers"
            value={stats.totalReceivers}
            color="purple"
          />
          <StatCard
            icon={Activity}
            label="Total Donations"
            value={stats.totalDonations}
            color="orange"
          />
          <StatCard
            icon={TrendingUp}
            label="Active Donations"
            value={stats.activeDonations}
            color="red"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed Donations"
            value={stats.completedDonations}
            color="indigo"
          />
          <StatCard
            icon={ShoppingBag}
            label="Accepted Donations"
            value={stats.acceptedDonations}
            color="blue"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/admin/users"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition text-center"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/donors"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition text-center"
            >
              Manage Donors
            </Link>
            <Link
              href="/admin/receivers"
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition text-center"
            >
              Manage Receivers
            </Link>
            <Link
              href="/admin/donations"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition text-center"
            >
              Manage Donations
            </Link>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}

export default page
