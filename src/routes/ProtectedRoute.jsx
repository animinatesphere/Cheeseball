import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { paths } from "./paths";
import { getCurrentUserStrict } from "@/services/api";

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState("loading"); // loading | authed | unauth
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await getCurrentUserStrict();
        if (!alive) return;
        setStatus("authed");
      } catch {
        if (!alive) return;
        setStatus("unauth");
      } finally {
        if (!alive) return;
        setChecked(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!checked || status === "loading") return null;
  if (status === "unauth") return <Navigate to={paths.login} replace />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
