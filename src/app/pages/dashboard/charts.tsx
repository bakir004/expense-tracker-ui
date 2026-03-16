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
                {data ? <TransactionTable readonly sortColumn={sortColumn} sort={sort} data={data} /> :
                    <TransactionTableSkeleton count={prevCount} />}
            </Stack>
        </>
    );
}
