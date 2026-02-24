import type { TransactionGroup } from "@/types/transaction-group";

export type CreateTransactionGroupRequest = Omit<TransactionGroup, 'id' | 'userId' | 'createdAt'>;

export type UpdateTransactionGroupRequest = Partial<CreateTransactionGroupRequest> & { id: number };
