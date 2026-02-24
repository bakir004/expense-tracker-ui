import { Typography } from "@/components/common/typography";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import type { ErrorResponse } from "@/types/error";
import type { TransactionPopulated } from "@/types/transaction";
import type { UseMutateFunction } from "@tanstack/react-query";
import { ArrowUpDown, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import {
	fromTransactionPopulatedToRequest,
	type UpdateTransactionRequest,
} from "../types/transaction-request";
import type { TransactionsWithPagingMetadata } from "../types/transaction-response";
import { DatePickerSimple } from "./date-picker";
import {
	DropdownMenuTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useGetCategories } from "@/features/categories/api/get-categories";
import { useGetTransactionGroups } from "@/features/transaction-groups/api/get-transaction-groups";
import { Badge } from "@/components/ui/badge";
import { PaymentMethod } from "@/types/payment-method";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
	Dialog,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface TransactionTableProps {
	data: TransactionsWithPagingMetadata;
	sort: (field: string) => void;
	sortColumn?: string;
	selectedTransactionIds: number[];
	setSelectedTransactionIds: React.Dispatch<React.SetStateAction<number[]>>;
	update: UseMutateFunction<
		TransactionPopulated,
		ErrorResponse,
		UpdateTransactionRequest,
		unknown
	>;
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
	update,
}: TransactionTableProps) {
	const sgn = (n: number) => (n < 0 ? "-" : "+");
	const formatAmount = (amount: number) =>
		`${sgn(amount)}$${Math.abs(amount)}`;
	const formatPaymentMethod = (method: string) =>
		method.replace("_", " ").toLowerCase();
	const { data: categories } = useGetCategories();
	const { data: transactionGroups } = useGetTransactionGroups();

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

	const [editingSubjectTransactionId, setEditingSubjectTransactionId] =
		useState<number | null>(null);
	const [editingNotesTransactionId, setEditingNotesTransactionId] = useState<
		number | null
	>(null);

	const startEditingSubjectForTransaction = (transactionId: number) => {
		setEditingSubjectTransactionId(transactionId);
	};
	const startEditingNotesForTransaction = (transactionId: number) => {
		setEditingNotesTransactionId(transactionId);
	};

	const updateTransaction = (transaction: TransactionPopulated) => {
		const updatedTransactionRequest =
			fromTransactionPopulatedToRequest(transaction);
		update(updatedTransactionRequest);
	};

	const saveSubjectForTransaction = (
		transaction: TransactionPopulated,
		newSubject: string,
	) => {
		setEditingSubjectTransactionId(null);
		if (newSubject === transaction.subject) return;
		const updatedTransaction = { ...transaction, subject: newSubject };
		updateTransaction(updatedTransaction);
	};
	const saveNotesForTransaction = (
		transaction: TransactionPopulated,
		newNotes: string,
	) => {
		setEditingNotesTransactionId(null);
		if (newNotes === transaction.notes) return;
		const updatedTransaction = { ...transaction, notes: newNotes };
		updateTransaction(updatedTransaction);
	};

	const handleCategoryChange = (
		transaction: TransactionPopulated,
		categoryId: string,
	) => {
		const updatedCategory = {
			...transaction.category,
			id: parseInt(categoryId),
		} as TransactionPopulated["category"];
		const updatedTransaction = {
			...transaction,
			category: updatedCategory,
		};
		updateTransaction(updatedTransaction);
	};

	const handleTransactionGroupChange = (
		transaction: TransactionPopulated,
		transactionGroupId: string,
	) => {
		const updatedTransactionGroup = {
			...transaction.transactionGroup,
			id: parseInt(transactionGroupId),
		} as TransactionPopulated["transactionGroup"];
		const updatedTransaction = {
			...transaction,
			transactionGroup: updatedTransactionGroup,
		};
		updateTransaction(updatedTransaction);
	};

	const handlePaymentMethodChange = (
		transaction: TransactionPopulated,
		paymentMethod: string,
	) => {
		const updatedTransaction = {
			...transaction,
			paymentMethod:
				paymentMethod as TransactionPopulated["paymentMethod"],
		};
		updateTransaction(updatedTransaction);
	};

	const openAddTransactionGroupDialog = (
		transaction: TransactionPopulated,
	) => {};

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
								"h-13 hover:bg-card/50",
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
							<TableCell className="font-medium pl-4 group">
								{editingSubjectTransactionId ===
								transaction.id ? (
									<input
										autoFocus
										defaultValue={transaction.subject}
										onBlur={(e) =>
											saveSubjectForTransaction(
												transaction,
												e.target.value.trim(),
											)
										}
										onKeyDown={(e) => {
											if (
												e.key === "Enter" &&
												(
													e.target as HTMLInputElement
												).value.trim() !== ""
											)
												saveSubjectForTransaction(
													transaction,
													(
														e.target as HTMLInputElement
													).value.trim(),
												);
											else if (e.key === "Enter")
												setEditingSubjectTransactionId(
													null,
												);
										}}
										className="w-full p-0 bg-transparent border border-muted focus:outline-none focus:border-muted-foreground"
									/>
								) : (
									<Typography
										className="text-xs cursor-pointer"
										onClick={() =>
											startEditingSubjectForTransaction(
												transaction.id,
											)
										}
									>
										{transaction.subject}
									</Typography>
								)}
								{editingNotesTransactionId ===
								transaction.id ? (
									<input
										autoFocus
										defaultValue={transaction.notes ?? ""}
										onBlur={(e) =>
											saveNotesForTransaction(
												transaction,
												e.target.value.trim(),
											)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter")
												saveNotesForTransaction(
													transaction,
													(
														e.target as HTMLInputElement
													).value.trim(),
												);
										}}
										className="w-full p-0 bg-transparent border border-muted focus:outline-none focus:border-muted-foreground text-xs"
									/>
								) : transaction.notes ? (
									<Typography
										onClick={() =>
											startEditingNotesForTransaction(
												transaction.id,
											)
										}
										className="text-muted-foreground hover:text-foreground cursor-pointer font-light text-xs"
									>
										{transaction.notes}
									</Typography>
								) : (
									<Typography
										onClick={() =>
											startEditingNotesForTransaction(
												transaction.id,
											)
										}
										className="cursor-pointer opacity-0 -mt-4 group-hover:-mt-0 transition-[margin,opacity] hover:text-foreground group-hover:opacity-100 text-muted-foreground font-light text-xs"
									>
										Add a note{" "}
										<Plus className="inline h-3 w-3" />
									</Typography>
								)}
							</TableCell>
							<TableCell className="group max-w-fit">
								<DatePickerSimple
									date={transaction.date}
									setDate={(date) => {
										const updatedTransaction = {
											...transaction,
											date,
										};
										updateTransaction(updatedTransaction);
									}}
								>
									<Button
										variant="ghost"
										id="date-picker-simple"
										className="items-center hover:bg-muted h-fit w-fit max-w-fit px-1 py-0.25 rounded cursor-pointer transition"
									>
										<Typography className="text-xs w-fit">
											{new Intl.DateTimeFormat(
												"en-GB",
											).format(transaction.date)}
										</Typography>
										<Pencil className="inline max-h-3 max-w-3 -mt-0.5 opacity-0 group-hover:opacity-100 transition" />
									</Button>
								</DatePickerSimple>
							</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											id="date-picker-simple"
											className="items-center hover:bg-muted h-fit w-fit max-w-fit px-1 py-0.25 rounded cursor-pointer transition"
										>
											<Typography className="text-xs w-fit">
												{transaction.category
													? `${transaction.category?.icon} ${transaction.category?.name}`
													: "None"}
											</Typography>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-fit">
										<DropdownMenuGroup>
											<DropdownMenuLabel className="py-1">
												Category
											</DropdownMenuLabel>
											<DropdownMenuRadioGroup
												className="max-h-64 overflow-y-scroll scrollbar-thin"
												onValueChange={(value) =>
													handleCategoryChange(
														transaction,
														value,
													)
												}
												value={
													transaction.category?.id.toString() ??
													undefined
												}
											>
												{categories?.map(
													(category, i) => (
														<DropdownMenuRadioItem
															key={i}
															value={category.id.toString()}
															className="py-1"
														>
															{`${category?.icon} ${category?.name}`}
														</DropdownMenuRadioItem>
													),
												)}
											</DropdownMenuRadioGroup>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Badge
											variant={
												transaction.transactionGroup
													? "secondary"
													: "ghost"
											}
											className="rounded-full cursor-pointer"
										>
											{transaction.transactionGroup
												? transaction.transactionGroup
														.name
												: "None"}
										</Badge>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-fit">
										<DropdownMenuGroup>
											<DropdownMenuLabel className="py-1">
												Transaction group
											</DropdownMenuLabel>
											<DropdownMenuRadioGroup
												className="max-h-64 overflow-y-auto scrollbar-thin"
												onValueChange={(value) =>
													handleTransactionGroupChange(
														transaction,
														value,
													)
												}
												value={
													transaction.transactionGroup?.id.toString() ??
													undefined
												}
											>
												{transactionGroups?.map(
													(transactionGroup, i) => (
														<DropdownMenuRadioItem
															key={i}
															value={transactionGroup.id.toString()}
															className="py-1"
														>
															{ transactionGroup.name }
														</DropdownMenuRadioItem>
													),
												)}
												<Dialog>
													<DialogTrigger className="text-xs text-primary w-full flex gap-1 items-center py-1 px-2 hover:bg-muted cursor-pointer">
														<Plus className="inline h-3 w-3" />
														New group
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle className="text-lg">
																Create a new transaction group
															</DialogTitle>
															<FieldGroup>
																<Field>
																	<Input
																		id="name-1"
																		name="name"
                                                                        placeholder="E.g. Grocery shopping"
																	/>
																</Field>
															</FieldGroup>
															<DialogDescription>
                                                                After creating the transaction group, you can select it from the dropdown menu.
															</DialogDescription>
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">
                                                                        Cancel
                                                                    </Button>
                                                                </DialogClose>
                                                                <Button type="submit">
                                                                    Create
                                                                </Button>
                                                            </DialogFooter>
														</DialogHeader>
													</DialogContent>
												</Dialog>
											</DropdownMenuRadioGroup>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											id="date-picker-simple"
											className="items-center capitalize hover:bg-muted h-fit w-fit max-w-fit px-1 py-0.25 rounded cursor-pointer transition"
										>
											<Typography className="text-xs w-fit">
												{formatPaymentMethod(
													transaction.paymentMethod,
												)}
											</Typography>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-fit">
										<DropdownMenuGroup>
											<DropdownMenuLabel className="py-1">
												Payment method
											</DropdownMenuLabel>
											<DropdownMenuRadioGroup
												onValueChange={(value) =>
													handlePaymentMethodChange(
														transaction,
														value,
													)
												}
												value={
													transaction.paymentMethod
												}
											>
												{Object.values(
													PaymentMethod,
												).map((method, i) => (
													<DropdownMenuRadioItem
														key={i}
														value={method}
														className="py-1 capitalize"
													>
														{formatPaymentMethod(
															method,
														)}
													</DropdownMenuRadioItem>
												))}
											</DropdownMenuRadioGroup>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
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
