import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Router from "./router.tsx";
import { AuthProvider } from "@/lib/auth-provider.tsx";

const queryClient = new QueryClient();

export default function Provider() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router />
                <Toaster />
            </AuthProvider>
        </QueryClientProvider>
    );
}
