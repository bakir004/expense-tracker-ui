import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./app";
import Dashboard from "./pages/dashboard/";
import Login from "./pages/login";
import Profile from "./pages/dashboard/profile";
import Home from "./pages/dashboard/home";
import Register from "./pages/register";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PublicOnlyRoute } from "@/components/auth/public-only-route";
import Landing from "./pages/landing";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Landing />,
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "dashboard",
                        element: <Dashboard />,
                        children: [
                            {
                                index: true,
                                element: <Home />,
                            },
                            {
                                path: "profile",
                                element: <Profile />,
                            },
                        ],
                    },
                ],
            },
            {
                element: <PublicOnlyRoute />,
                children: [
                    {
                        path: "login",
                        element: <Login />,
                    },
                    {
                        path: "register",
                        element: <Register />,
                    },
                ],
            },
        ],
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}

export default Router;
