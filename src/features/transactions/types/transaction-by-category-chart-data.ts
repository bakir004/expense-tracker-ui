import type { Transaction } from "@/types/transaction"

export type TransactionByCategoryChartDataResponse = {
    chartData: TransactionByCategoryChartData[]
}

export type TransactionByCategoryChartData = {
    categoryId: number,
    netExpenses: number,
    transactions: Transaction[]
}
