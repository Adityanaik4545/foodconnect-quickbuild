"use client"
import { useEffect, useState } from "react";
import { getReceiverAcceptedDonations } from '@/app/actions/donations';
import { CheckCircle2, Clock, MapPin, Package } from "lucide-react";
import React from 'react'

const page = () => {
    const [acceptedDonations, setAcceptedDonations] = useState([]);

  useEffect(() => {
    getReceiverAcceptedDonations().then(setAcceptedDonations);
  }, []);

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
 return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Accepted Meals</h1>

      { acceptedDonations.length > 0 ? (
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
                  )}
    </div>
  );
}

export default page
