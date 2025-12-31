"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getUserRole } from "@/app/actions/getUserRole";
import { isUserRestricted } from "@/app/actions/admin";

export default function AuthRedirect() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    (async () => {
      // admin shortcut
      if (session.user.email === "admin@foodconnect.com") {
        router.replace("/admin/dashboard");
        return;
      }

      // restricted user check
      const restriction = await isUserRestricted();
        if (restriction.isRestricted) {
        router.replace("/restricted");
        return;
      }

      const role = await getUserRole();

      if (!role) {
        router.replace("/role"); // first-time user
      } else if (role === "donor") {
        router.replace("/dashboard/donor_panel");
      } else {
        router.replace("/dashboard/receiver_panel");
      }
    })();
  }, [session, isPending,router]);

  return (
    <div className="h-screen flex items-center justify-center text-slate-500">
      Signing you in…
    </div>
  );
}
