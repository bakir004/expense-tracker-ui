import type { Transaction, TransactionPopulated } from "@/types/transaction";

export type UpdateTransactionRequest = Omit<Transaction, 'date' | 'userId' | 'createdAt' | 'updatedAt' | 'cumulativeDelta' | 'signedAmount'> & {
    date: string,
}
export type CreateTransactionRequest = Omit<UpdateTransactionRequest, 'id'>;

export function fromTransactionPopulatedToRequest(transaction: TransactionPopulated): UpdateTransactionRequest {
    return {
        id: transaction.id,
        transactionType: transaction.transactionType,
        amount: transaction.amount,
        date: transaction.date.toISOString().split('T')[0],
        subject: transaction.subject,
        notes: transaction.notes,
        paymentMethod: transaction.paymentMethod,
        categoryId: transaction.category?.id || null,
        transactionGroupId: transaction.transactionGroup?.id || null,
    }
}

