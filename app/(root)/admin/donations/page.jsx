"use client";

import AdminGuard from '../../../../components/AdminGuard'
import React, { useEffect, useState } from 'react'
import { getAllDonationsForAdmin, getDonationStats } from '@/app/actions/adminStats'
import { Search, Gift, MapPin} from 'lucide-react'

const DonationsPage = () => {
  const [donations, setDonations] = useState([])
  const [filteredDonations, setFilteredDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [stats, setStats] = useState({
    byType: { veg: 0, nonVeg: 0 },
    byCategory: { cooked: 0, raw: 0, packed: 0 },
    byStatus: { available: 0, completed: 0 },
    total: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterDonations()
  }, [searchTerm, selectedStatus, selectedType, donations])

  const loadData = async () => {
    try {
      const [donationsData, statsData] = await Promise.all([
        getAllDonationsForAdmin(),
        getDonationStats(),
      ])
      setDonations(donationsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterDonations = () => {
    let filtered = donations

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(d => d.status === selectedStatus)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(d => d.type === selectedType)
    }

    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.mealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.donorId?.includes(searchTerm)
      )
    }

    setFilteredDonations(filtered)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const StatusBadge = ({ status }) => {
    if (status === 'available') {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Available</span>
    }
    if (status === 'completed') {
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Completed</span>
    }
    return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>
  }

  const TypeBadge = ({ type }) => {
    if (type === 'veg') {
      return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">Vegetarian</span>
    }
    if (type === 'non-veg') {
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Non-Veg</span>
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">Unknown</span>
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading donations...</p>
          </div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Donations</h1>
          <p className="text-gray-600">Monitor and manage all food donations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <p className="text-gray-600 text-sm">Total Donations</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <p className="text-gray-600 text-sm">Available</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.byStatus.available}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.byStatus.completed}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <p className="text-gray-600 text-sm">Vegetarian</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.byType.veg}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <p className="text-gray-600 text-sm">Non-Veg</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.byType.nonVeg}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search meal name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>
          </div>
        </div>

        {/* Donations Table */}
        {filteredDonations.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Meal Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Prepared Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.donationId} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{donation.mealName || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{donation.donorId.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <TypeBadge type={donation.type} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 capitalize">{donation.category || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-800">{donation.quantity} units</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-800">{formatDate(donation.preparedTime)}</p>
                          <p className="text-xs text-gray-500">{formatTime(donation.preparedTime)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={donation.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-1 text-sm text-gray-600">
                          <MapPin size={16} className="mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{donation.address || 'N/A'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Gift size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">No donations found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}

export default DonationsPage
