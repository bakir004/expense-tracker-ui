import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/error";
import { toast } from "sonner";
import type { CreateTransactionRequest } from "../types/transaction-request";
import type { TransactionPopulated } from "@/types/transaction";

export const createTransactionsRequest = (transaction: CreateTransactionRequest): Promise<TransactionPopulated> => {
    return apiClient<TransactionPopulated>("/transactions", {
        body: transaction
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    const toastId = "create-transaction-toast";

    return useMutation<TransactionPopulated, ErrorResponse, CreateTransactionRequest>({
        mutationFn: (transaction: CreateTransactionRequest) => createTransactionsRequest(transaction),
        onMutate: () => {
            toast.loading("Creating transaction...", { id: toastId });
            return { toastId };
        },
        onSuccess: () => {
            toast.success("Created transaction successfully.", { id: toastId });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
        onError: (error) => {
            toast.error(`Failed to create transaction: ${error.title || "Unknown error"}`, { 
                id: toastId 
            });
        }
    });
};
