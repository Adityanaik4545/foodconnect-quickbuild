"use client";

import AdminGuard from '../../../../components/AdminGuard'
import React, { useEffect, useState } from 'react'
import { getAllDonors } from '@/app/actions/adminStats'
import { Search, Heart, Phone, MapPin, Gift } from 'lucide-react'

const DonorsPage = () => {
    const [donors, setDonors] = useState([])
    const [filteredDonors, setFilteredDonors] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadDonors()
    }, [])

    useEffect(() => {
        const filtered = donors.filter(donor =>
            donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donor.phoneNumber?.includes(searchTerm) ||
            donor.address?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredDonors(filtered)
    }, [searchTerm, donors])

    const loadDonors = async () => {
        try {
            const data = await getAllDonors()
            setDonors(data)
            setFilteredDonors(data)
        } catch (error) {
            console.error('Error loading donors:', error)
        } finally {
            setLoading(false)
        }
    }

    const DonorCard = ({ donor }) => (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Heart size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{donor.name || 'N/A'}</h3>
                        <p className="text-xs text-gray-500">Donor ID: {donor.userId.slice(0, 8)}...</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{donor.donationCount}</div>
                    <p className="text-xs text-gray-500">donations</p>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                {donor.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={16} className="text-gray-400" />
                        {donor.phoneNumber}
                    </div>
                )}
                {donor.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-400 mt-0.5" />
                        <span className="line-clamp-2">{donor.address}</span>
                    </div>
                )}
            </div>

            <button className="w-full py-2 px-3 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg transition text-sm">
                View Details
            </button>
        </div>
    )

    if (loading) {
        return (
            <AdminGuard>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">Loading donors...</p>
                    </div>
                </div>
            </AdminGuard>
        )
    }

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Donors</h1>
                    <p className="text-gray-600">View and manage all registered donors</p>
                </div>

                {/* Stats Summary */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6 flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-gray-600 text-sm">Total Donors</p>
                        <p className="text-3xl font-bold text-green-600">{donors.length}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-600 text-sm">Avg Donations</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {donors.length > 0
                                ? (donors.reduce((sum, d) => sum + d.donationCount, 0) / donors.length).toFixed(1)
                                : 0}
                        </p>
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-600 text-sm">Total Donations</p>
                        <p className="text-3xl font-bold text-orange-600">
                            {donors.reduce((sum, d) => sum + d.donationCount, 0)}
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, phone, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>

                {/* Donors Grid */}
                {filteredDonors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDonors.map((donor) => (
                            <DonorCard key={donor.userId} donor={donor} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-600 font-medium">No donors found</p>
                        <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </AdminGuard>
    )
}

export default DonorsPage
