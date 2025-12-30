import { getCurrentUser } from "@/lib/auth";
import DashboardLayout from "./layout-client";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return <DashboardLayout children={children} user={user}></DashboardLayout>;
}
