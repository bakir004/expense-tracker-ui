export const TransactionType = {
    EXPENSE: 'EXPENSE',
    INCOME: 'INCOME',
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];
