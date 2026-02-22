import type { TransactionPopulated } from "@/types/transaction"

export type TransactionsWithPagingMetadata = {
    transactions: TransactionPopulated[],
    totalCount: number,
    pageSize: number,
    currentPage: number,
    totalPages: number
}

