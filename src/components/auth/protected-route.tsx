import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
    const location = useLocation();

    const isAuthenticated = document.cookie
        .split("; ")
        .some((row) => row.startsWith("jwt="));

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
