import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import RoleSelection from "./RoleSelection";

export default async function RolePage() {
  const role = await getUserRole();

  if (role === "donor") {
    redirect("/dashboard/donor_panel");
  }

  if (role === "receiver") {
    redirect("/dashboard/receiver_panel");
  }

  return <RoleSelection />;
}
