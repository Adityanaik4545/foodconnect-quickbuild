"use server";

import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { donation, acceptedDonation, userProfile, user } from "@/drizzle/schema";
import { eq, desc, and, or } from "drizzle-orm";
import { headers } from "next/headers";

// Get all donations for a donor
export async function getDonorDonations() {
  const reqHeaders = await headers();
  const { user } = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!user?.id) {
    throw new Error("Not authenticated");
  }

  const donations = await db
    .select()
    .from(donation)
    .where(eq(donation.donorId, user.id))
    .orderBy(desc(donation.createdAt));

  // Get all accepted donations to count acceptances for each donation
  const allAccepted = await db
    .select()
    .from(acceptedDonation);

  // Map donations with status
  return donations.map((don) => {
    const acceptedForThisDonation = allAccepted.filter(
      (acc) => acc.donationId === don.donationId
    );
    return {
      id: don.donationId,
      mealName: don.mealName,
      preparedTime: don.preparedTime,
      quantity: don.quantity,
      type: don.type,
      category: don.category,
      status: don.status,
      address: don.address,
      description: don.description,
      createdAt: don.createdAt,
      acceptedCount: acceptedForThisDonation.length,
    };
  });
}

// Get available donations for receivers
export async function getAvailableDonations() {
  const reqHeaders = await headers();
  const { user: sessionUser } = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!sessionUser?.id) {
    throw new Error("Not authenticated");
  }

  // Get user's location if available
  const profile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, sessionUser.id))
    .limit(1);

  const donationsResult = await db
    .select()
    .from(donation)
    .where(eq(donation.status, "available"))
    .orderBy(desc(donation.createdAt));

  // Get user names for all donors
  const donorIds = [...new Set(donationsResult.map(d => d.donorId))];
  
  // Create a map of donor IDs to names
  const donorMap = new Map<string, string>();
  // Fetch users individually to avoid type issues
  for (const donorId of donorIds) {
    const donorResult = await db
      .select()
      .from(user)
      .where(eq(user.id, donorId))
      .limit(1);
    if (donorResult.length > 0) {
      donorMap.set(donorId, donorResult[0].name);
    }
  }

  const donations = donationsResult.map((row) => ({
    donationId: row.donationId,
    mealName: row.mealName,
    preparedTime: row.preparedTime,
    quantity: row.quantity,
    type: row.type,
    category: row.category,
    status: row.status,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.createdAt,
    donorName: donorMap.get(row.donorId) || "Anonymous",
  }));

  // Get accepted donations to filter out already accepted ones
  const acceptedDonations = await db
    .select()
    .from(acceptedDonation)
    .where(eq(acceptedDonation.receiverId, sessionUser.id));

  const acceptedDonationIds = new Set(
    acceptedDonations.map((acc) => acc.donationId)
  );

  return donations
    .filter((don) => !acceptedDonationIds.has(don.donationId))
    .map((don) => ({
      donationId: don.donationId,
      mealName: don.mealName,
      preparedTime: don.preparedTime,
      quantity: don.quantity,
      type: don.type,
      category: don.category,
      status: don.status,
      address: don.address,
      latitude: don.latitude,
      longitude: don.longitude,
      createdAt: don.createdAt,
      donorName: don.donorName || "Anonymous",
    }));
}

// Create a new donation
export async function createDonation(data: {
  mealName: string;
  preparedTime: Date;
  quantity: number;
  type?: string;
  category?: string;
  description?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
}) {
  const reqHeaders = await headers();
  const { user } = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!user?.id) {
    throw new Error("Not authenticated");
  }

  const newDonation = await db
    .insert(donation)
    .values({
      donorId: user.id,
      mealName: data.mealName,
      preparedTime: data.preparedTime,
      quantity: data.quantity,
      type: data.type || null,
      category: data.category || null,
      description: data.description || null,
      address: data.address || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      status: "available",
    })
    .returning();

  return newDonation[0];
}

// Accept a donation
export async function acceptDonation(donationId: string) {
  const reqHeaders = await headers();
  const { user } = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!user?.id) {
    throw new Error("Not authenticated");
  }

  // Check if donation exists and is available
  const donationRecord = await db
    .select()
    .from(donation)
    .where(eq(donation.donationId, donationId))
    .limit(1);

  if (donationRecord.length === 0) {
    throw new Error("Donation not found");
  }

  if (donationRecord[0].status !== "available") {
    throw new Error("Donation is no longer available");
  }

  // Check if already accepted by this user
  const existing = await db
    .select()
    .from(acceptedDonation)
    .where(
      and(
        eq(acceptedDonation.donationId, donationId),
        eq(acceptedDonation.receiverId, user.id)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    throw new Error("You have already accepted this donation");
  }

  // Create accepted donation record
  const accepted = await db
    .insert(acceptedDonation)
    .values({
      donationId: donationId,
      receiverId: user.id,
      status: "accepted",
    })
    .returning();

  // Update donation status if quantity is limited (optional logic)
  // For now, we'll keep it available for others

  return accepted[0];
}

// Get accepted donations for a receiver
export async function getReceiverAcceptedDonations() {
  const reqHeaders = await headers();
  const { user: sessionUser } = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!sessionUser?.id) {
    throw new Error("Not authenticated");
  }

  const receiverId = sessionUser.id;

  const acceptedResult = await db
    .select()
    .from(acceptedDonation)
    .innerJoin(donation, eq(acceptedDonation.donationId, donation.donationId))
    .where(eq(acceptedDonation.receiverId, receiverId))
    .orderBy(desc(acceptedDonation.acceptedAt));

  // Get user names for all donors
  const donorIds = [...new Set(acceptedResult.map(a => a.donation.donorId))];
  const donorMap = new Map<string, string>();
  // Fetch users individually to avoid type issues
  for (const donorId of donorIds) {
    const donorResult = await db
      .select()
      .from(user)
      .where(eq(user.id, donorId))
      .limit(1);
    if (donorResult.length > 0) {
      donorMap.set(donorId, donorResult[0].name);
    }
  }

  const accepted = acceptedResult.map((row: any) => ({
    acceptedId: row.accepted_donation.acceptedId,
    donationId: row.accepted_donation.donationId,
    acceptedAt: row.accepted_donation.acceptedAt,
    pickedAt: row.accepted_donation.pickedAt,
    status: row.accepted_donation.status,
    mealName: row.donation.mealName,
    preparedTime: row.donation.preparedTime,
    quantity: row.donation.quantity,
    type: row.donation.type,
    category: row.donation.category,
    address: row.donation.address,
    latitude: row.donation.latitude,
    longitude: row.donation.longitude,
    donorName: donorMap.get(row.donation.donorId) || "Anonymous",
  }));

  return accepted;
}

// Update donation
export async function updateDonation(donationId: string, data: {
  mealName?: string;
  preparedTime?: Date;
  quantity?: number;
  type?: string;
  category?: string;
  description?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
}) {
  const reqHeaders = await headers();
  const { user } = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!user?.id) {
    throw new Error("Not authenticated");
  }

  // First check if the donation belongs to the user
  const existingDonation = await db
    .select()
    .from(donation)
    .where(eq(donation.donationId, donationId))
    .limit(1);

  if (existingDonation.length === 0) {
    throw new Error("Donation not found");
  }

  if (existingDonation[0].donorId !== user.id) {
    throw new Error("Not authorized to update this donation");
  }

  // Only allow updates if status is available
  if (existingDonation[0].status !== "available") {
    throw new Error("Cannot update donation that is not available");
  }

  const updateData: any = {};
  if (data.mealName !== undefined) updateData.mealName = data.mealName;
  if (data.preparedTime !== undefined) updateData.preparedTime = data.preparedTime;
  if (data.quantity !== undefined) updateData.quantity = data.quantity;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.latitude !== undefined) updateData.latitude = data.latitude;
  if (data.longitude !== undefined) updateData.longitude = data.longitude;

  await db
    .update(donation)
    .set(updateData)
    .where(eq(donation.donationId, donationId));

  return { success: true };
}

// Delete donation
export async function deleteDonation(donationId: string) {
  const reqHeaders = await headers();
  const { user } = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!user?.id) {
    throw new Error("Not authenticated");
  }

  // First check if the donation belongs to the user
  const existingDonation = await db
    .select()
    .from(donation)
    .where(eq(donation.donationId, donationId))
    .limit(1);

  if (existingDonation.length === 0) {
    throw new Error("Donation not found");
  }

  if (existingDonation[0].donorId !== user.id) {
    throw new Error("Not authorized to delete this donation");
  }

  // Only allow deletion if status is available (not claimed or completed)
  if (existingDonation[0].status !== "available") {
    throw new Error("Cannot delete donation that has been claimed or completed");
  }

  await db
    .delete(donation)
    .where(eq(donation.donationId, donationId));

  return { success: true };
}

