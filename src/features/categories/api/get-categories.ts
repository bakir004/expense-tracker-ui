import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client.ts";
import type { Category } from "@/types/category";

export const getCategoriesRequest = (): Promise<Category[]> => {
    return apiClient<Category[]>("/categories/");
};

export const useGetCategories = () => {
    return useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: () => getCategoriesRequest(),
    });
};
