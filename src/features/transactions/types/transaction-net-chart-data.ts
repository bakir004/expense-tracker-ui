import type { Transaction } from "@/types/transaction"

export type TransactionNetChartDataRequest = {
    dateFrom?: string,
    dateTo?: string,
}

export type TransactionNetChartDataResponse = {
    chartData: TransactionNetChartData[]
}

export type TransactionNetChartData = {
    date: string,
    netAmount: number,
    netExpenses: number,
    netIncome: number,
    transactions: Transaction[]
}
