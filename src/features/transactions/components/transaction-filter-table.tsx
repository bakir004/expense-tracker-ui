import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useGetTransactions } from "../api/get-transactions";
import type { TransactionsFilterRequest } from "../types/transactions-filter";
import TransactionFilters from "./transaction-filters";
import TransactionTable from "./transaction-table";
import TransactionTableSkeleton from "./transaction-table-skeleton";
import { toast } from "sonner";

const DEFAULT_PAGE_SIZE = 10;

export default function TransactionFilterTable() {
	const [filters, setFilters] = useState<TransactionsFilterRequest>({
		page: 1,
		pageSize: DEFAULT_PAGE_SIZE,
	});
	const [prevCount, setPrevCount] = useState(DEFAULT_PAGE_SIZE);
	const [sortColumn, setSortColumn] = useState<string>("date");
	const { data, isLoading } = useGetTransactions(filters);
	const [selectedTransactionIds, setSelectedTransactionIds] = useState<number[]>([]);

	if (data?.transactions?.length && data.transactions.length !== prevCount) {
		setPrevCount(data.transactions.length);
	}

	const skeletonCount = data?.transactions?.length || prevCount;

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

	const sort = (field: string) => {
		setSortColumn(field);
		setFilters((prev) => {
			const isSameField = prev.sortBy === field;
			const newSortDirection =
				isSameField && prev.sortDirection === "asc" ? "desc" : "asc";
			return { ...prev, sortBy: field, sortDirection: newSortDirection };
		});
	};

    useEffect(() => {
        if (selectedTransactionIds.length === 0) {
            toast.dismiss("transaction-selection");
            return;
        }
        const toastId = "transaction-selection";

        toast.info(`Selected ${selectedTransactionIds.length} transaction${selectedTransactionIds.length > 1 ? "s" : ""}`, {
            id: toastId,
            duration: Infinity,
            cancel: {
                label: "Cancel",
                onClick: () => setSelectedTransactionIds([])
            }
        });
    }, [selectedTransactionIds])

	return (
		<>
			<TransactionFilters filters={filters} setFilters={setFilters} />

			{data && !isLoading ? (
				<TransactionTable
                    selectedTransactionIds={selectedTransactionIds}
                    setSelectedTransactionIds={setSelectedTransactionIds}
					sortColumn={sortColumn}
					data={data}
					sort={sort}
				/>
			) : (
				<TransactionTableSkeleton count={skeletonCount} />
			)}

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
							isActive={filters.page === data?.currentPage}
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
	);
}
