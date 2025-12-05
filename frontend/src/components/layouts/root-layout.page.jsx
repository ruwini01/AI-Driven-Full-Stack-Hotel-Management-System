import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";

export default function RootProtectLayout({ children }) {
  const { user, isLoaded } = useUser();
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setRedirect(null);
      return;
    }

    const role = user.publicMetadata?.role;

    if (role === "admin") {
      setRedirect("/admin");
    } else {
      setRedirect(null);
    }
  }, [user, isLoaded]);

  if (!isLoaded) return null;

  if (redirect) return <Navigate to={redirect} replace />;

  return children;
}
