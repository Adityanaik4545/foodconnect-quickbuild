"use server";

import { db } from "@/drizzle/db";
import { user, donation, acceptedDonation, userProfile } from "@/drizzle/schema";
import { eq, count } from "drizzle-orm";
import { email } from "zod";

export async function getAdminStats() {
    try {
        // Total users
        const totalUsers = await db
            .select({ count: count() })
            .from(user);

        // Count by role
        const donorCount = await db
            .select({ count: count() })
            .from(userProfile)
            .where(eq(userProfile.role, "donor"));

        const receiverCount = await db
            .select({ count: count() })
            .from(userProfile)
            .where(eq(userProfile.role, "receiver"));

        // Donation stats
        const totalDonations = await db
            .select({ count: count() })
            .from(donation);

        const activeDonations = await db
            .select({ count: count() })
            .from(donation)
            .where(eq(donation.status, "available"));

        const completedDonations = await db
            .select({ count: count() })
            .from(donation)
            .where(eq(donation.status, "completed"));

        // Accepted donations
        const acceptedCount = await db
            .select({ count: count() })
            .from(acceptedDonation);

        return {
            totalUsers: totalUsers[0]?.count || 0,
            totalDonors: donorCount[0]?.count || 0,
            totalReceivers: receiverCount[0]?.count || 0,
            totalDonations: totalDonations[0]?.count || 0,
            activeDonations: activeDonations[0]?.count || 0,
            completedDonations: completedDonations[0]?.count || 0,
            acceptedDonations: acceptedCount[0]?.count || 0,
        };
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return {
            totalUsers: 0,
            totalDonors: 0,
            totalReceivers: 0,
            totalDonations: 0,
            activeDonations: 0,
            completedDonations: 0,
            acceptedDonations: 0,
        };
    }
}

export async function getAllDonors() {
    try {
        const donors = await db
            .select({
                userId: userProfile.userId,
                name: userProfile.name,
                phoneNumber: userProfile.phoneNumber,
                address: userProfile.address,
            })
            .from(userProfile)
            .where(eq(userProfile.role, "donor"));

        // Get donation count for each donor
        const donatorsWithCount = await Promise.all(
            donors.map(async (donor) => {
                const donationCount = await db
                    .select({ count: count() })
                    .from(donation)
                    .where(eq(donation.donorId, donor.userId));
                return {
                    ...donor,
                    donationCount: donationCount[0]?.count || 0,
                };
            })
        );

        return donatorsWithCount;
    } catch (error) {
        console.error("Error fetching donors:", error);
        return [];
    }
}

export async function getAllReceivers() {
    try {
        const receivers = await db
            .select({
                userId: userProfile.userId,
                name: userProfile.name,
                phoneNumber: userProfile.phoneNumber,
                address: userProfile.address,
            })
            .from(userProfile)
            .where(eq(userProfile.role, "receiver"));

        // Get acceptance count for each receiver
        const receiversWithCount = await Promise.all(
            receivers.map(async (receiver) => {
                const acceptanceCount = await db
                    .select({ count: count() })
                    .from(acceptedDonation)
                    .where(eq(acceptedDonation.receiverId, receiver.userId));
                return {
                    ...receiver,
                    acceptanceCount: acceptanceCount[0]?.count || 0,
                };
            })
        );

        return receiversWithCount;
    } catch (error) {
        console.error("Error fetching receivers:", error);
        return [];
    }
}

export async function getAllDonationsForAdmin() {
    try {
        const donations_data = await db
            .select()
            .from(donation);

        return donations_data;
    } catch (error) {
        console.error("Error fetching donations:", error);
        return [];
    }
}

export async function getAllUsers() {
    try {
        const users_data = await db
            .select({
                userId: userProfile.userId,
                name: userProfile.name,
                email: user.email,
                role: userProfile.role,
                phoneNumber: userProfile.phoneNumber,
                address: userProfile.address,
            })
            .from(userProfile)
            .innerJoin(user, eq(user.id, userProfile.userId));

        return users_data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getDonationStats() {
    try {
        const allDonations = await db.select().from(donation);

        const byType = {
            veg: allDonations.filter((d) => d.type === "veg").length,
            nonVeg: allDonations.filter((d) => d.type === "non-veg").length,
        };

        const byCategory = {
            cooked: allDonations.filter((d) => d.category === "cooked").length,
            raw: allDonations.filter((d) => d.category === "raw").length,
            packed: allDonations.filter((d) => d.category === "packed").length,
        };

        const byStatus = {
            available: allDonations.filter((d) => d.status === "available").length,
            completed: allDonations.filter((d) => d.status === "completed").length,
        };

        return {
            byType,
            byCategory,
            byStatus,
            total: allDonations.length,
        };
    } catch (error) {
        console.error("Error fetching donation stats:", error);
        return {
            byType: { veg: 0, nonVeg: 0 },
            byCategory: { cooked: 0, raw: 0, packed: 0 },
            byStatus: { available: 0, completed: 0 },
            total: 0,
        };
    }
}
