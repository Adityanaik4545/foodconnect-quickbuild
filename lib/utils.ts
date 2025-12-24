import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export const navItemClass = (isActive: any) =>
  isActive
    ? "w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-400 text-white font-medium transition-all hover:bg-emerald-600 shadow-md"
    : "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium transition-all hover:bg-slate-100";

export function formatDate(date: Date | string) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
