import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import type {
    RegisterCredentials,
    RegisterResponse,
} from "../types/register.ts";
import type { AuthErrorResponse } from "../types/common.ts";

export const registerRequest = (
    credentials: RegisterCredentials,
): Promise<RegisterResponse> => {
    return apiClient<RegisterResponse>("/auth/register", {
        body: credentials,
    });
};

export const useRegister = () => {
    return useMutation<
        RegisterResponse,
        AuthErrorResponse,
        RegisterCredentials
    >({
        mutationFn: registerRequest,
    });
};
