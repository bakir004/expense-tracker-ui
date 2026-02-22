import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import type { TransactionsFilterRequest, TransactionsFilterResponse } from "../types/transactions-filter";
import { fromStringToEnum } from "@/utils/enum-string-mapper";
import { TransactionType } from "@/types/transaction-type";
import { PaymentMethod } from "@/types/payment-method";
import type { TransactionsWithPagingMetadata } from "../types/transaction-response";
import type { ErrorResponse } from "@/types/error";
import { useGetCategories } from "@/features/categories/api/get-categories";
import { useGetTransactionGroups } from "@/features/transaction-groups/api/get-transaction-groups";
import type { Transaction } from "@/types/transaction";

export const getTransactionsRequest = (filters: TransactionsFilterRequest): Promise<TransactionsFilterResponse> => {
    return apiClient<TransactionsFilterResponse>("/transactions/", {
        params: filters,
    });
};

export const useGetTransactions = (filters: TransactionsFilterRequest) => {
    const { data: categories } = useGetCategories();
    const { data: transactionGroups } = useGetTransactionGroups();

    return useQuery<TransactionsFilterResponse, ErrorResponse, TransactionsWithPagingMetadata>({
        queryKey: ["transactions", filters],
        queryFn: () => getTransactionsRequest(filters),
        select: (data) => {
            const populatedTransactions = data?.transactions.map((transaction: Transaction) => ({
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
                category: categories?.find((category) => category.id === transaction.categoryId),
                transactionGroup: transactionGroups?.find((group) => group.id === transaction.transactionGroupId),
                createdAt: new Date(transaction.createdAt),
                updatedAt: new Date(transaction.updatedAt),
            }));

            return {
                transactions: populatedTransactions || [],
                totalCount: data?.totalCount || 0,
                pageSize: data?.pageSize || 0,
                currentPage: data?.currentPage || 0,
                totalPages: data?.totalPages || 0,
            }
        }
    });
};
