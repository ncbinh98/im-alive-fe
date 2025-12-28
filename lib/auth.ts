import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

/* 
  After login, nextAuth gonna store user data in session,
  we can access it from here
*/
export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const getAccessToken = async () => {
  const session: any = await getServerSession(authOptions);
  return session?.accessToken;
};

// Re-export for server components
export { authOptions };
