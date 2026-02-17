import type { TransactionResponse } from "./transaction-response"

export type TransactionsFilterRequest = {
    transactionType?: string,
    minAmount?: number,
    maxAmount?: number,
    dateFrom?: string,
    dateTo?: string,
    subjectContains?: string,
    notesContains?: string,
    paymentMethods?: string[],
    categoryIds?: number[],
    uncategorized?: boolean,
    transactionGroupIds?: number[],
    ungrouped?: boolean,
    sortBy?: string,
    sortDirection?: string,
    page: number,
    pageSize: number,
}

export type TransactionsFilterResponse = {
    transactions: TransactionResponse[],
    totalCount: number,
    pageSize: number,
    currentPage: number,
    totalPages: number
}

