import { Typography } from "@/components/common/typography";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TransactionsWithPagingMetadata } from "../types/transaction-response";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TransactionTableProps {
	data: TransactionsWithPagingMetadata;
	sort: (field: string) => void;
	sortColumn?: string;
	selectedTransactionIds: number[];
	setSelectedTransactionIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const columns = [
	{ key: "subject", label: "Subject", width: "w-3/12" },
	{ key: "date", label: "Date", width: "w-2/12" },
	{ key: "categoryId", label: "Category", width: "w-2/12" },
	{ key: "transactionGroupId", label: "Transaction group", width: "w-1/12" },
	{ key: "paymentMethod", label: "Payment method", width: "w-1/12" },
	{ key: "amount", label: "Amount", width: "w-1/12 text-right" },
];

export default function TransactionTable({
	data,
	sort,
	sortColumn,
	selectedTransactionIds = [],
	setSelectedTransactionIds = () => {},
}: TransactionTableProps) {
	const sgn = (n: number) => (n < 0 ? "-" : "+");
	const formatAmount = (amount: number) =>
		`${sgn(amount)}$${Math.abs(amount)}`;
	const formatPaymentMethod = (method: string) =>
		method.replace("_", " ").toLowerCase();

	const handleCheckboxCheck = (
		checked: string | boolean,
		transactionId: number,
	) => {
		setSelectedTransactionIds((prev) => {
			if (checked) return [...prev, transactionId];
			else return prev.filter((id: number) => id !== transactionId);
		});
	};
	const allSelectedForActivePage = data.transactions.every((t) =>
		selectedTransactionIds.find((id) => id === t.id),
	);

	const toggleSelectingAllTransactionsOnActivePage = () => {
		if (allSelectedForActivePage)
			setSelectedTransactionIds((prev) =>
				prev.filter(
					(id: number) => !data.transactions.find((t) => t.id === id),
				),
			);
		else
			setSelectedTransactionIds((prev) => [
				...prev,
				...data.transactions
					.filter((t) => !prev.find((id: number) => id === t.id))
					.map((t) => t.id),
			]);
	};

	return (
		<ScrollArea className="whitespace-nowrap w-0 min-w-full">
			<Table>
				<TableCaption className="mb-4">
					Showing{" "}
					{(data.currentPage - 1) * data.pageSize +
						(data.transactions.length > 0 ? 1 : 0)}
					-
					{(data.currentPage - 1) * data.pageSize +
						data.transactions.length}{" "}
					of {data.totalCount} transactions
				</TableCaption>
				<TableHeader className="bg-card">
					<TableRow>
						<TableHead className="w-8">
							<Checkbox
								checked={allSelectedForActivePage}
								onCheckedChange={
									toggleSelectingAllTransactionsOnActivePage
								}
							/>
						</TableHead>
						{columns.map((col) => (
							<TableHead className={col.width} key={col.key}>
								<Button
									variant="ghost"
									onClick={() => sort(col.key)}
									className={
										sortColumn === col.key
											? "text-primary"
											: ""
									}
								>
									{col.label}
									<ArrowUpDown className="h-2 w-2" />
								</Button>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.transactions.map((transaction, i: number) => (
						<TableRow
							key={i}
							className={cn(
								"h-13",
								selectedTransactionIds.find(
									(id) => id === transaction.id,
								)
									? "bg-card"
									: "",
							)}
						>
							<TableCell>
								<Checkbox
									checked={
										!!selectedTransactionIds.find(
											(id) => id === transaction.id,
										)
									}
									onCheckedChange={(c) =>
										handleCheckboxCheck(c, transaction.id)
									}
								/>
							</TableCell>
							<TableCell className="font-medium pl-4">
								{transaction.subject}
								<br />
								<Typography className="text-muted-foreground font-light text-xs mt-0.5">
									{transaction.notes}
								</Typography>
							</TableCell>
							<TableCell>
								{new Intl.DateTimeFormat("en-GB").format(
									transaction.date,
								)}
							</TableCell>
							<TableCell>
								{transaction.category
									? `${transaction.category.icon} ${transaction.category.name}`
									: "-"}
							</TableCell>
							<TableCell>
								{transaction.transactionGroup?.name ?? "-"}
							</TableCell>
							<TableCell className="capitalize">
								{formatPaymentMethod(transaction.paymentMethod)}
							</TableCell>
							<TableCell
								className={cn(
									"text-right",
									transaction.signedAmount < 0
										? "text-destructive"
										: "text-primary",
								)}
							>
								{formatAmount(transaction.signedAmount)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}
