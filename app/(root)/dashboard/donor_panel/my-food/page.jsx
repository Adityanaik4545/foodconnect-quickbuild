"use client";

import React, { useState, useEffect } from 'react';
import { Package, Edit2, Trash2, MapPin, Clock, Calendar, Search, Filter, X, Check } from 'lucide-react';
import { getDonorDonations, updateDonation, deleteDonation } from '@/app/actions/donations';

// Dummy data
const DUMMY_DONATIONS = [
  {
    id: 1,
    mealName: "Vegetable Biryani",
    quantity: 15,
    category: "Lunch",
    type: "Vegetarian",
    status: "available",
    address: "123 MG Road, Bangalore",
    preparedTime: "2024-12-22T12:30:00",
    expiryTime: "2024-12-22T18:00:00",
    description: "Fresh vegetable biryani with raita",
    createdAt: "2024-12-22T11:00:00"
  },
  {
    id: 2,
    mealName: "Chicken Curry with Rice",
    quantity: 20,
    category: "Dinner",
    type: "Non-Vegetarian",
    status: "available",
    address: "456 Brigade Road, Bangalore",
    preparedTime: "2024-12-22T10:00:00",
    expiryTime: "2024-12-22T16:00:00",
    description: "Homestyle chicken curry with steamed rice",
    createdAt: "2024-12-22T09:30:00"
  },
  {
    id: 3,
    mealName: "Masala Dosa",
    quantity: 30,
    category: "Breakfast",
    type: "Vegetarian",
    status: "claimed",
    address: "789 Koramangala, Bangalore",
    preparedTime: "2024-12-21T07:00:00",
    expiryTime: "2024-12-21T12:00:00",
    description: "Crispy dosas with potato filling",
    createdAt: "2024-12-21T06:30:00"
  },
  {
    id: 4,
    mealName: "Dal Tadka with Roti",
    quantity: 25,
    category: "Lunch",
    type: "Vegetarian",
    status: "completed",
    address: "321 Indiranagar, Bangalore",
    preparedTime: "2024-12-20T11:00:00",
    expiryTime: "2024-12-20T17:00:00",
    description: "Yellow dal with fresh rotis and pickle",
    createdAt: "2024-12-20T10:00:00"
  },
  {
    id: 5,
    mealName: "Paneer Tikka",
    quantity: 12,
    category: "Snacks",
    type: "Vegetarian",
    status: "available",
    address: "567 Whitefield, Bangalore",
    preparedTime: "2024-12-22T15:00:00",
    expiryTime: "2024-12-22T20:00:00",
    description: "Grilled paneer tikka with mint chutney",
    createdAt: "2024-12-22T14:30:00"
  },
  {
    id: 6,
    mealName: "Mixed Vegetable Curry",
    quantity: 18,
    category: "Dinner",
    type: "Vegetarian",
    status: "completed",
    address: "890 HSR Layout, Bangalore",
    preparedTime: "2024-12-19T18:00:00",
    expiryTime: "2024-12-19T22:00:00",
    description: "Mixed vegetables in aromatic curry",
    createdAt: "2024-12-19T17:00:00"
  }
];

const FoodListPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getDonorDonations();
      setDonations(data);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await deleteDonation(id);
      await fetchDonations(); // Refresh the list
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete donation:', error);
      alert('Failed to delete donation. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (donation) => {
    setEditingItem(donation);
  };

  const handleSaveEdit = async () => {
    try {
      setUpdating(true);
      await updateDonation(editingItem.id, {
        mealName: editingItem.mealName,
        preparedTime: new Date(editingItem.preparedTime),
        quantity: editingItem.quantity,
        type: editingItem.type,
        category: editingItem.category,
        description: editingItem.description,
        address: editingItem.address,
      });
      await fetchDonations(); // Refresh the list
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update donation:', error);
      alert('Failed to update donation. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Filter donations
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.mealName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         donation.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || donation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: donations.length,
    available: donations.filter(d => d.status === 'available').length,
    claimed: donations.filter(d => d.status === 'claimed').length,
    completed: donations.filter(d => d.status === 'completed').length
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Food Listings</h1>
            <p className="text-slate-600">Manage all your food donations in one place</p>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-slate-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Loading your donations...</h3>
              <p className="text-slate-600">Please wait while we fetch your food listings</p>
            </div>
          ) : (
            <>
              {/* Search and Filter */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by meal name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  filterStatus === 'all'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('available')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  filterStatus === 'available'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setFilterStatus('claimed')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  filterStatus === 'claimed'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Claimed
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  filterStatus === 'completed'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDonations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      donation.status === 'available' ? 'bg-emerald-100' : 
                      donation.status === 'claimed' ? 'bg-orange-100' : 
                      'bg-slate-100'
                    }`}>
                      <Package className={`w-7 h-7 ${
                        donation.status === 'available' ? 'text-emerald-600' : 
                        donation.status === 'claimed' ? 'text-orange-600' : 
                        'text-slate-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {donation.mealName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          donation.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 
                          donation.status === 'claimed' ? 'bg-orange-100 text-orange-700' : 
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {donation.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-slate-500">
                          {donation.type} • {donation.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <p className="text-slate-700">{donation.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Quantity</p>
                    <p className="text-lg font-semibold text-slate-900">{donation.quantity} servings</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Listed on</p>
                    <p className="text-lg font-semibold text-slate-900">{formatDate(donation.createdAt)}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{donation.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Prepared: {formatTime(donation.preparedTime)}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer - Actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => handleEdit(donation)}
                  disabled={donation.status === 'completed'}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    donation.status === 'completed'
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(donation.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDonations.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No items found</h3>
            <p className="text-slate-600">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by listing your first food donation!'}
            </p>
          </div>
        )}
        </>
        )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Edit Food Listing</h2>
              <button
                onClick={() => setEditingItem(null)}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-all"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Meal Name</label>
                <input
                  type="text"
                  value={editingItem.mealName}
                  onChange={(e) => setEditingItem({...editingItem, mealName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                  >
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>Snacks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <input
                  type="text"
                  value={editingItem.address}
                  onChange={(e) => setEditingItem({...editingItem, address: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={updating}
                className="flex-1 px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-3">Delete Food Listing?</h2>
            <p className="text-slate-600 text-center mb-8">
              This action cannot be undone. The listing will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodListPage;