"use client";

import AdminGuard from '../../../../components/AdminGuard'
import React, { useEffect, useState } from 'react'
import { getAllReceivers } from '@/app/actions/adminStats'
import { Search, ShoppingBag, Phone, MapPin } from 'lucide-react'

const ReceiversPage = () => {
    const [receivers, setReceivers] = useState([])
    const [filteredReceivers, setFilteredReceivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadReceivers()
    }, [])

    useEffect(() => {
        const filtered = receivers.filter(receiver =>
            receiver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receiver.phoneNumber?.includes(searchTerm) ||
            receiver.address?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredReceivers(filtered)
    }, [searchTerm, receivers])

    const loadReceivers = async () => {
        try {
            const data = await getAllReceivers()
            setReceivers(data)
            setFilteredReceivers(data)
        } catch (error) {
            console.error('Error loading receivers:', error)
        } finally {
            setLoading(false)
        }
    }

    const ReceiverCard = ({ receiver }) => (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <ShoppingBag size={20} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{receiver.name || 'N/A'}</h3>
                        <p className="text-xs text-gray-500">Receiver ID: {receiver.userId.slice(0, 8)}...</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{receiver.acceptanceCount}</div>
                    <p className="text-xs text-gray-500">acceptances</p>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                {receiver.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={16} className="text-gray-400" />
                        {receiver.phoneNumber}
                    </div>
                )}
                {receiver.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-400 mt-0.5" />
                        <span className="line-clamp-2">{receiver.address}</span>
                    </div>
                )}
            </div>

            <button className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-lg transition text-sm">
                View Details
            </button>
        </div>
    )

    if (loading) {
        return (
            <AdminGuard>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">Loading receivers...</p>
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Receivers</h1>
                    <p className="text-gray-600">View and manage all registered receivers</p>
                </div>

                {/* Stats Summary */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6 flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-gray-600 text-sm">Total Receivers</p>
                        <p className="text-3xl font-bold text-purple-600">{receivers.length}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-600 text-sm">Avg Acceptances</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {receivers.length > 0
                                ? (receivers.reduce((sum, r) => sum + r.acceptanceCount, 0) / receivers.length).toFixed(1)
                                : 0}
                        </p>
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-600 text-sm">Total Acceptances</p>
                        <p className="text-3xl font-bold text-orange-600">
                            {receivers.reduce((sum, r) => sum + r.acceptanceCount, 0)}
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
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                {/* Receivers Grid */}
                {filteredReceivers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredReceivers.map((receiver) => (
                            <ReceiverCard key={receiver.userId} receiver={receiver} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-600 font-medium">No receivers found</p>
                        <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </AdminGuard>
    )
}

export default ReceiversPage
