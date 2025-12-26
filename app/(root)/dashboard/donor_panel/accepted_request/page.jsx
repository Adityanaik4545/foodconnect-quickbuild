"use client";

import { useEffect, useState } from "react";
import {
    Phone,
    MapPin,
    CheckCircle2,
    Package,
    Copy,
} from "lucide-react";
import { getDonorAcceptedRequests } from "@/app/actions/donations";
import { formatDate, formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { confirmPickup } from "@/app/actions/donations";


export default function AcceptedRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDonorAcceptedRequests()
            .then(setRequests)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p className="text-slate-500">Loading accepted requests…</p>;
    }

    if (requests.length === 0) {
        return (
            <div className="text-center py-16 text-slate-500">
                No accepted requests yet.
            </div>
        );
    }

    const handleConfirmPickup = async (acceptedId) => {
        try {
            await confirmPickup(acceptedId);
            setRequests((prev) =>
                prev.map((r) =>
                    r.acceptedId === acceptedId
                        ? { ...r, pickedAt: new Date(), acceptedStatus: "picked" }
                        : r
                )
            );
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Accepted Requests
                </h1>
                <p className="text-slate-500">
                    People who accepted your food donations.
                </p>
            </div>

            <div className="space-y-4">
                {requests.map((req) => (
                    <div
                        key={req.acceptedId}
                        className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-6">
                            {/* LEFT */}
                            <div className="flex gap-4 flex-1">
                                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <Package className="w-7 h-7 text-orange-600" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {req.mealName}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Qty {req.quantity} · Listed {formatDate(req.createdAt)}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                                        <MapPin className="w-4 h-4" />
                                        {req.address}
                                    </div>

                                    <div className="flex items-center gap-3 mt-4">
                                        <a
                                            href={`tel:${req.receiverPhone}`}
                                            className="
                                            flex items-center gap-2
                                            px-4 py-2
                                            rounded-xl
                                            bg-emerald-500 text-white
                                            hover:bg-emerald-600
                                            transition
                                        "
                                        >
                                            <Phone className="w-4 h-4" />
                                            Call
                                        </a>

                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(req.receiverPhone);
                                                alert("Phone number copied");
                                            }}
                                            className="flex justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copy Number
                                        </button>



                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(req.receiverAddress)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                                        >
                                            <MapPin className="w-4 h-4" />
                                            View Location
                                        </a>

                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="text-right space-y-3">
                                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                                    {req.acceptedStatus}
                                </span>

                                <div className="text-sm">
                                    <p className="font-medium">{req.receiverName}</p>
                                    <p className="text-slate-500">{req.receiverPhone}</p>
                                    <p className="text-slate-500">{req.receiverAddress}</p>
                                </div>

                                {!req.pickedAt && (
                                    <button
                                    onClick={() => handleConfirmPickup(req.acceptedId)} 
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 ml-auto">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Confirm Pickup
                                    </button>
                                )}


                                {req.pickedAt && (
                                    <p className="text-xs text-emerald-600">
                                        Picked on {formatDateTime(req.pickedAt)}
                                    </p>
                                )}

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
