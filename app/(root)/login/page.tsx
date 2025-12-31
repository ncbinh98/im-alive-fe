import { getCurrentUser } from "@/lib/auth";
import LoginPageClient from "./page-client";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return <LoginPageClient user={user} />;
}
