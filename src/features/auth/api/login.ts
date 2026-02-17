import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import type { LoginCredentials, LoginResponse } from "../types/login.ts";
import type { AuthErrorResponse } from "../types/common.ts";
import { useAuth } from "@/lib/auth-provider";

export const loginRequest = (
    credentials: LoginCredentials,
): Promise<LoginResponse> => {
    return apiClient<LoginResponse>("/auth/login", {
        body: credentials,
    });
};

export const useLogin = () => {
    const { setUser } = useAuth();

    return useMutation<LoginResponse, AuthErrorResponse, LoginCredentials>({
        mutationFn: loginRequest,
        onSuccess: (data: LoginResponse) => {
            document.cookie = `jwt=${data.token}; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 7}`;

            const user = {
                id: data.id,
                name: data.name,
                email: data.email,
                initialBalance: data.initialBalance,
            };

            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
        },
    });
};
