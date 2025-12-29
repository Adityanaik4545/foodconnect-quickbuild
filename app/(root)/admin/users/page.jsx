"use client";

import AdminGuard from '../../../../components/AdminGuard'
import React, { useEffect, useState } from 'react'
import { getAllUsers } from '@/app/actions/adminStats'
import { Search, Users, Phone, MapPin, Heart, ShoppingBag, UserCheck } from 'lucide-react'
import { DeleteUser } from '@/components/DeleteUser';

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)


  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [searchTerm, selectedRole, users])

  const loadUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (selectedRole !== 'all') {
      filtered = filtered.filter(u => u.role === selectedRole)
    }

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phoneNumber?.includes(searchTerm) ||
        u.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.userId?.includes(searchTerm)
      )
    }

    setFilteredUsers(filtered)
  }

  const RoleBadge = ({ role }) => {
    if (role === 'donor') {
      return (
        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <Heart size={14} />
          Donor
        </div>
      )
    }
    if (role === 'receiver') {
      return (
        <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          <ShoppingBag size={14} />
          Receiver
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
        <UserCheck size={14} />
        {role || 'Unassigned'}
      </div>
    )
  }

  const stats = {
    total: users.length,
    donors: users.filter(u => u.role === 'donor').length,
    receivers: users.filter(u => u.role === 'receiver').length,
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading users...</p>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Users</h1>
          <p className="text-gray-600">View and manage all registered users on the platform</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <Heart className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Donors</p>
                <p className="text-2xl font-bold text-green-600">{stats.donors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <ShoppingBag className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Receivers</p>
                <p className="text-2xl font-bold text-purple-600">{stats.receivers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, phone, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Filter by Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="donor">Donors Only</option>
                <option value="receiver">Receivers Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{user.name || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 font-mono">{user.userId.slice(0, 8)}...</p>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4">
                        {user.phoneNumber ? (
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <Phone size={14} className="text-gray-400" />
                            {user.phoneNumber}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {user.address ? (
                          <div className="flex items-start gap-1 text-sm text-gray-700">
                            <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{user.address}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition">
                          View Details
                        </button>
                        <button
                        onClick={()=>{
                          setSelectedUser(user);
                          setOpenDelete(true);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Restrict
                        </button>
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">No users found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {selectedUser && (
        <DeleteUser
        open= {openDelete}
        onOpenChange= {setOpenDelete}
        user= {selectedUser}
        />
      )}
    </AdminGuard>
  )
}

export default UsersPage
