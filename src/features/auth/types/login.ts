export type LoginCredentials = {
    email: string;
    password: string;
};

export type LoginResponse = {
    id: number;
    name: string;
    email: string;
    initialBalance: number;
    token: string;
    expiresAt: string;
};
