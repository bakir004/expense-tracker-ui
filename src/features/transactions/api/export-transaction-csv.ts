import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/error";
import { toast } from "sonner";
import type { TransactionsFilterRequest } from "../types/transactions-filter";

export const downloadTransactionsCsvRequest = (filters: TransactionsFilterRequest): Promise<Blob> => {
    return apiClient<Blob>("/transactions/export", {
        params: filters,
        responseType: "blob",
    });
};

export const useExportTransactions = () => {
    return useMutation<Blob, ErrorResponse, TransactionsFilterRequest>({
        mutationFn: (filters: TransactionsFilterRequest) => downloadTransactionsCsvRequest(filters),
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            
            const date = new Date().toISOString().split('T')[0];
            link.setAttribute("download", `transactions_${date}.csv`);
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("CSV exported successfully");
        },
        onError: (error) => {
            console.error("Failed to export CSV:", error);
            toast.error(`Failed to export CSV: ${error.title || "Unknown error"}`);
        }
    });
};
