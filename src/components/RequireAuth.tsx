// src/components/RequireAuth.tsx
import type { ReactElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSession } from "../utils/auth";

const RequireAuth = (): ReactElement => {
    const session = getSession();
    const location = useLocation();

    if (!session) {
        return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
};

export default RequireAuth;
