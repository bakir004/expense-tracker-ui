export type TransactionsErrorResponse = {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    errors: {
        [key: string]: [string]
    }
};
