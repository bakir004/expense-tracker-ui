import { Typography } from "@/components/common/typography";
import { TransactionsByCategoryChart } from "@/features/transactions/components/transaction-category-chart";
import { TransactionNetChart } from "@/features/transactions/components/transaction-net-chart";
import { Group } from "@/components/layout/group";
import { Stack } from "@/components/layout/stack";
import TransactionTable from "@/features/transactions/components/transaction-table";
import { useGetTransactions } from "@/features/transactions/api/get-transactions";
import { useState } from "react";
import type { TransactionsFilterRequest } from "@/features/transactions/types/transactions-filter";
import TransactionTableSkeleton from "@/features/transactions/components/transaction-table-skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function Charts() {
    const [filters, setFilters] = useState<TransactionsFilterRequest>({
        page: 1,
        pageSize: 10,
    });
    const { data } = useGetTransactions(filters);
    const [prevCount, setPrevCount] = useState(10);
    const [sortColumn, setSortColumn] = useState<string>("date");

    if (data?.transactions?.length && data.transactions.length !== prevCount) {
        setPrevCount(data.transactions.length);
    }

    const setDate = (date: string) => {
        const newFilters: TransactionsFilterRequest = {
            page: 1,
            pageSize: 10,
            dateFrom: date,
            dateTo: date,
        };
        setFilters(newFilters);
    }

    const setCategory = (categoryId: number) => {
        const newFilters: TransactionsFilterRequest = {
            page: 1,
            pageSize: 10,
            categoryIds: [categoryId],
        };
        setFilters(newFilters);
    }

    const sort = (field: string) => {
        setSortColumn(field);
        setFilters((prev) => {
            const isSameField = prev.sortBy === field;
            const newSortDirection =
                isSameField && prev.sortDirection === "asc" ? "desc" : "asc";
            return { ...prev, sortBy: field, sortDirection: newSortDirection };
        });
    };

    const prev = () =>
        setFilters((prev) => ({
            ...prev,
            page: Math.max(1, (prev.page || 1) - 1),
        }));
    const next = () =>
        setFilters((prev) => ({
            ...prev,
            page: Math.min((prev.page || 1) + 1, data?.totalPages || 1),
        }));

    return (
        <>
            <Typography className="mt-4" variant="h3">Dashboard Charts</Typography>
            <Typography>
                Visualize your financial data with various charts and graphs.
            </Typography>
            <Stack padding={0}>
                <Group padding={0}>
                    <TransactionNetChart setDate={setDate} />
                    <TransactionsByCategoryChart setCategory={setCategory} />
                </Group>
                {data ? (
                    <>
                        <TransactionTable
                            readonly
                            sortColumn={sortColumn}
                            sort={sort}
                            data={data}
                        />
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem className="cursor-pointer">
                                    <PaginationPrevious onClick={prev} />
                                </PaginationItem>

                                {filters.page && filters.page < 2 && (
                                    <PaginationItem>
                                        <PaginationLink>&nbsp;</PaginationLink>
                                    </PaginationItem>
                                )}

                                {filters.page && filters.page >= 2 && (
                                    <PaginationItem className="cursor-pointer">
                                        <PaginationLink onClick={prev}>
                                            {filters.page - 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                <PaginationItem className="cursor-pointer">
                                    <PaginationLink
                                        isActive={
                                            filters.page === data?.currentPage
                                        }
                                    >
                                        {filters.page}
                                    </PaginationLink>
                                </PaginationItem>

                                {filters.page <= (data?.totalPages ?? 0) - 1 && (
                                    <PaginationItem className="cursor-pointer">
                                        <PaginationLink onClick={next}>
                                            {filters.page + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                {filters.page > (data?.totalPages ?? 0) - 1 && (
                                    <PaginationItem>
                                        <PaginationLink>&nbsp;</PaginationLink>
                                    </PaginationItem>
                                )}

                                <PaginationItem className="cursor-pointer">
                                    <PaginationNext onClick={next} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </>
                ) : (
                    <TransactionTableSkeleton count={prevCount} />
                )}
            </Stack>
        </>
    );
}
