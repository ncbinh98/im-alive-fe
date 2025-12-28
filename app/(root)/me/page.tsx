import { getCurrentUser } from "@/lib/auth";
import ProfilePageClient from "./profile-client";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return (
      <div>
        <h1>Not authenticated</h1>
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return <ProfilePageClient user={user} />;
}