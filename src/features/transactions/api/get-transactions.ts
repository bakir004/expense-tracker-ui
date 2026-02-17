import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import type { TransactionsFilterRequest, TransactionsFilterResponse } from "../types/transactions-filter";
import type { TransactionsErrorResponse } from "../types/common";
import type { Transaction } from "@/types/transaction";
import { fromStringToEnum } from "@/utils/enum-mapper";
import { TransactionType } from "@/types/transaction-type";
import { PaymentMethod } from "@/types/payment-method";
import type { TransactionResponse } from "../types/transaction-response";

export const getTransactionsRequest = (filters: TransactionsFilterRequest): Promise<TransactionsFilterResponse> => {
    return apiClient<TransactionsFilterResponse>("/transactions/", {
        params: filters,
    });
};

export const useGetTransactions = (filters: TransactionsFilterRequest) => {
    return useQuery<TransactionsFilterResponse, TransactionsErrorResponse, Transaction[]>({
        queryKey: ["transactions", filters],
        queryFn: () => getTransactionsRequest(filters),
        select: (data) => {
            return data?.transactions.map((transaction: TransactionResponse) => ({
                id: transaction.id,
                userId: transaction.userId,
                transactionType: fromStringToEnum(TransactionType, transaction.transactionType),
                amount: transaction.amount,
                signedAmount: transaction.signedAmount,
                date: new Date(transaction.date),
                subject: transaction.subject,
                notes: transaction.notes,
                paymentMethod: fromStringToEnum(PaymentMethod, transaction.paymentMethod),
                cumulativeDelta: transaction.cumulativeDelta,
                categoryId: transaction.categoryId,
                transactionGroupId: transaction.transactionGroupId,
                createdAt: new Date(transaction.createdAt),
                updatedAt: new Date(transaction.updatedAt),
            }));
        }
    });
};
