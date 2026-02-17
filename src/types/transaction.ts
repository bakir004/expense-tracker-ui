import type { Category } from "./category";
import type { TransactionGroup } from "./transaction-group";
import { PaymentMethod } from "./payment-method";
import { TransactionType } from "./transaction-type";

export type Transaction = {
    id: number,
    userId: number,
    transactionType: TransactionType,
    amount: number,
    signedAmount: number,
    date: Date,
    subject: string,
    notes?: string,
    paymentMethod: PaymentMethod,
    cumulativeDelta: number,
    categoryId?: number,
    transactionGroupId?: number,
    createdAt: Date,
    updatedAt: Date,
}

export type TransactionPopulated = {
    id: number,
    userId: number,
    transactionType: TransactionType,
    amount: number,
    signedAmount: number,
    date: Date,
    subject: string,
    notes?: string,
    paymentMethod: PaymentMethod,
    cumulativeDelta: number,
    category?: Category,
    transactionGroup?: TransactionGroup,
    createdAt: Date,
    updatedAt: Date,
}

