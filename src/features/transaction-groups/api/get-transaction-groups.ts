import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import type { TransactionGroup } from "@/types/transaction-group";

export const getTransactionGroups = (): Promise<TransactionGroup[]> => {
    return apiClient<TransactionGroup[]>("/transaction-groups/");
};

export const useGetTransactionGroups = () => {
    return useQuery<TransactionGroup[]>({
        queryKey: ["transaction-groups"],
        queryFn: () => getTransactionGroups(),
    });
};
