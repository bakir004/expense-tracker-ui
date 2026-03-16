export type UpdateUserRequest = {
    currentPassword: string;
    name?: string | null;
    email?: string | null;
    newPassword?: string | null;
    initialBalance?: number | null;
};

export type UpdateUserResponse = {
    id: number;
    name: string;
    email: string;
    initialBalance: number;
    updatedAt: string;
};
