"use client"
import { signOut } from '@/lib/auth-client';
import { AlertTriangle, LogOut } from 'lucide-react';
import React from 'react'

const RestrictedClient = ({ restriction }) => {
      const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          Account Restricted
        </h1>
        <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />

        <p className="text-slate-600 mb-4">
          Your account has been restricted by an administrator.
        </p>

        {restriction?.restrictedReason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
            <strong>Reason:</strong> {restriction.restrictedReason}
          </div>
        )}

        <p className="text-sm text-slate-500 mb-6">
          If you believe this is a mistake, please contact support.
        </p>
        <a
  href="mailto:support@foodconnect.com?subject=Account%20Restriction%20Appeal"
  className="inline-block text-sm font-medium text-emerald-600 hover:underline mb-6"
>
  support@foodconnect.com
</a>

          <button onClick={handleLogout}   className="
    w-full flex items-center justify-center gap-2
    rounded-xl border border-slate-300
    bg-white text-slate-800
    py-3 font-medium
    hover:bg-slate-100
    transition-all
  ">
    <LogOut className="w-4 h-4" />
            Sign out & switch account
          </button>
      </div>
    </div>
  )
}

export default RestrictedClient
