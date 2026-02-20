import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/error";
import { toast } from "sonner";

export const deleteTransactionsRequest = (ids: number[]): Promise<number> => {
    return apiClient<number>("/transactions/batch", {
        method: "DELETE",
        body: ids
    });
};

export const useBatchDeleteTransactions = (ids: number[]) => {
    const queryClient = useQueryClient();
    return useMutation<number, ErrorResponse, number[]>({
        mutationFn: () => deleteTransactionsRequest(ids),
        onSuccess: () => {
            toast.success(`Deleted transactions successfully.`);
            queryClient.invalidateQueries({ queryKey: ["transactions"]});
        },
        onError: (error) => {
            toast.error(`Failed to delete transactions: ${error.title || "Unknown error"}`);
        }
    });
};
