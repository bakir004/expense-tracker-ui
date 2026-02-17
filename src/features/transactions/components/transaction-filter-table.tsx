import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";
import { useGetTransactions } from "../api/get-transactions";
import type { TransactionsFilterRequest } from "../types/transactions-filter";
import TransactionFilters from "./transaction-filters";
import TransactionTable from "./transaction-table";
import TransactionTableSkeleton from "./transaction-table-skeleton";

export default function TransactionFilterTable() {
    const [filters, setFilters] = useState<TransactionsFilterRequest>({
        page: 1,
        pageSize: 10
    });
    const { data, isLoading, error } = useGetTransactions(filters)
    const prev = () => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }));
    const next = () => setFilters((prev) => ({ ...prev, page: Math.min((prev.page || 1) + 1, data?.totalPages || 1) }));
    return (
        <>
            <TransactionFilters filters={filters} setFilters={setFilters} />
            {data && !isLoading ?
                <TransactionTable 
                    isLoading={isLoading} 
                    data={data}
                    error={error}
                />
                :
                <TransactionTableSkeleton count={filters.pageSize} />
            }
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
                            <PaginationLink onClick={prev}>{filters.page-1}</PaginationLink>
                        </PaginationItem>
                    )}
                    <PaginationItem className="cursor-pointer">
                        <PaginationLink isActive={filters.page === data?.currentPage}>
                            {filters.page}
                        </PaginationLink>
                    </PaginationItem>
                    {filters.page <= (data?.totalPages ?? 0) - 1 && 
                        <PaginationItem className="cursor-pointer">
                            <PaginationLink onClick={next}>{filters.page+1}</PaginationLink>
                        </PaginationItem>
                    }
                    {filters.page > (data?.totalPages ?? 0) - 1 && 
                        <PaginationItem>
                            <PaginationLink>&nbsp;</PaginationLink>
                        </PaginationItem>
                    }
                    <PaginationItem className="cursor-pointer">
                        <PaginationNext onClick={next} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    )
}
