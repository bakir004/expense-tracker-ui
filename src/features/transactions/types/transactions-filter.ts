import type { Transaction } from "@/types/transaction"

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
    transactions: Transaction[],
    totalCount: number,
    pageSize: number,
    currentPage: number,
    totalPages: number
}

