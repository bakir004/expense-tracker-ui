export type RegisterCredentials = {
    name: string;
    email: string;
    password: string;
    initialBalance: number;
};

export type RegisterResponse = {
    id: number;
    name: string;
    email: string;
    initialBalance: number;
    createdAt: string;
};
