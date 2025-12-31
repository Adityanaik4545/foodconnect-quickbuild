import { isUserRestricted } from "@/app/actions/admin";
import RestrictedClient from "@/components/RestrictedClient";

export default async function RestrictedPage() {
const restriction = await isUserRestricted();

  return <RestrictedClient restriction={restriction}/>
}
