import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/error";
import { toast } from "sonner";
import type { UpdateTransactionRequest } from "../types/transaction-request";
import type { TransactionPopulated } from "@/types/transaction";

export const updateTransactionsRequest = (transaction: UpdateTransactionRequest): Promise<TransactionPopulated> => {
    return apiClient<TransactionPopulated>(`/transactions/${transaction.id}`, {
        method: "PUT",
        body: transaction
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    const toastId = "update-transaction-toast";

    return useMutation<TransactionPopulated, ErrorResponse, UpdateTransactionRequest>({
        mutationFn: (transaction: UpdateTransactionRequest) => updateTransactionsRequest(transaction),
        onMutate: () => {
            toast.loading("Updating transaction...", { id: toastId });
            return { toastId };
        },
        onSuccess: () => {
            toast.success("Updated transaction successfully.", { id: toastId });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
        onError: (error) => {
            toast.error(`Failed to update transaction: ${error.title || "Unknown error"}`, { 
                id: toastId 
            });
        }
    });
};
