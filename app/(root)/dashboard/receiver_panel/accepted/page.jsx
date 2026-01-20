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
      className="
        relative overflow-hidden
        rounded-2xl border border-emerald-200
        bg-white
        shadow-sm hover:shadow-md
        transition-all
      "
    >
      {/* subtle background glow */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-50/50 via-transparent to-transparent pointer-events-none" />

      <div className="relative p-6 flex gap-6">
        {/* LEFT ICON */}
        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-emerald-100 to-green-100 flex items-center justify-center shadow-inner shrink-0">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {donation.mealName}
          </h3>

          <p className="text-sm text-slate-500 mb-3">
            Listed by{" "}
            <span className="font-medium">
              {donation.donorName || "Anonymous"}
            </span>
          </p>

          {/* META */}
          <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
            <span className="flex items-center gap-1 text-slate-600">
              <Package className="w-4 h-4" />
              Qty {donation.quantity}
            </span>

            {donation.type && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                {donation.type}
              </span>
            )}

            {donation.category && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                {donation.category}
              </span>
            )}

            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-4 h-4" />
              {formatDateTime(donation.preparedTime)}
            </span>
          </div>

          {/* LOCATION */}
          {donation.address && (
            <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span className="truncate">{donation.address}</span>
            </div>
          )}

          {/* STATUS ROW */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span
              className={`px-3 py-1 rounded-full font-medium flex items-center gap-1
                ${
                  donation.status === "accepted"
                    ? "bg-blue-100 text-blue-700"
                    : donation.status === "picked"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-700"
                }
              `}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {donation.status}
            </span>

            <span className="text-slate-500">
              Accepted {formatDateTime(donation.acceptedAt)}
            </span>

            {donation.pickedAt && (
              <span className="text-slate-500">
                Picked {formatDateTime(donation.pickedAt)}
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
