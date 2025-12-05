import { Outlet, Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

export default function AdminProtectLayout() {
  const { user } = useUser();

  if (!user) return null; // loading state

  if (user.publicMetadata?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
