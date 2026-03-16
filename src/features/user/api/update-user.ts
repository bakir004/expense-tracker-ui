import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { UpdateUserRequest, UpdateUserResponse } from "../types/profile";
import type { ErrorResponse } from "@/types/error";
import { useAuth } from "@/lib/auth-provider";

export const updateUserProfileRequest = (
    payload: UpdateUserRequest,
): Promise<UpdateUserResponse> => {
    return apiClient<UpdateUserResponse>("/users/profile", {
        method: "PUT",
        body: payload,
    });
};

export const useUpdateUserProfile = () => {
    const { setUser } = useAuth();

    return useMutation<
        UpdateUserResponse,
        ErrorResponse,
        UpdateUserRequest
    >({
        mutationFn: updateUserProfileRequest,
        onSuccess: (data) => {
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

