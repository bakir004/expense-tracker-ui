export type TransactionResponse = {
    id: number,
    userId: number,
    transactionType: string,
    amount: number,
    signedAmount: number,
    date: string,
    subject: string,
    notes?: string,
    paymentMethod: string,
    cumulativeDelta: number,
    categoryId?: number,
    transactionGroupId?: number,
    createdAt: Date,
    updatedAt: Date
}

