"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminGuard({ children }) {
  const { data: session, isPending } = useSession();  // correct for your version
  const router = useRouter();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isPending) return; // wait until session is loaded

    console.log("SESSION →", session);

    // Not logged in
    if (!session?.user) {
      router.replace("/login");
      return;
    }

    // Not admin
    if (session.user.email !== "admin@foodconnect.com") {
      router.replace("/unauthorized");
      return;
    }

    setChecked(true); // allowed
  }, [session, isPending, router]);

  if (isPending || !checked) {
    return <div className="p-6">Loading...</div>;
  }

  return <>{children}</>;
}
