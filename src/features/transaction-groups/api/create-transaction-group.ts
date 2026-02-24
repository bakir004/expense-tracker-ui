import { apiClient } from "@/lib/api-client.ts";
import type { ErrorResponse } from "@/types/error";
import type { TransactionGroup } from "@/types/transaction-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateTransactionGroupRequest } from "../types/transaction-group";

export const createTransactionGroup = (transactionGroup: CreateTransactionGroupRequest): Promise<TransactionGroup> => {
    return apiClient<TransactionGroup>("/transaction-groups/", {
        body: transactionGroup,
    });
};

export const useCreateTransactionGroup = () => {
    const queryClient = useQueryClient();
    const toastId = "create-transaction-group-toast";

    return useMutation<TransactionGroup, ErrorResponse, CreateTransactionGroupRequest>({
        mutationFn: (transactionGroup: CreateTransactionGroupRequest) => createTransactionGroup(transactionGroup),
        onMutate: () => {
            toast.loading("Creating transaction group...", { id: toastId });
            return { toastId };
        },
        onSuccess: () => {
            toast.success("Created transaction successfully.", { id: toastId });
            queryClient.invalidateQueries({ queryKey: ["transaction-groups"] });
        },
        onError: (error) => {
            toast.error(`Failed to create transaction group: ${error.title || "Unknown error"}`, { 
                id: toastId 
            });
        }
    });
};
