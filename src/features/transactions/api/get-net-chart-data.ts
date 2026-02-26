import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import type { ErrorResponse } from "@/types/error";
import type { TransactionNetChartDataRequest, TransactionNetChartDataResponse } from "../types/transaction-net-chart-data";

export const getTransactionNetChartData = (request: TransactionNetChartDataRequest): Promise<TransactionNetChartDataResponse> => {
    return apiClient<TransactionNetChartDataResponse>("/transactions/net-chart-data", {
        body: request,
    });
};

export const useGetTransactionsNetChartData = (request: TransactionNetChartDataRequest) => {
    return useQuery<TransactionNetChartDataResponse, ErrorResponse>({
        queryKey: ["transactions/net-chart-data", request],
        queryFn: () => getTransactionNetChartData(request)
    });
};
