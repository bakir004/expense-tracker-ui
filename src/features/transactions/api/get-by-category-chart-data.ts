import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import type { ErrorResponse } from "@/types/error";
import type { TransactionByCategoryChartDataResponse } from "../types/transaction-by-category-chart-data";

export const getTransactionByCategoryChartData = (): Promise<TransactionByCategoryChartDataResponse> => {
    return apiClient<TransactionByCategoryChartDataResponse>("/transactions/category-chart-data");
};

export const useGetTransactionsByCategoryChartData = () => {
    return useQuery<TransactionByCategoryChartDataResponse, ErrorResponse>({
        queryKey: ["transactions/by-category-chart-data"],
        queryFn: () => getTransactionByCategoryChartData()
    });
};
