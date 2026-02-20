import { Typography } from "@/components/common/typography";
import { Group } from "@/components/layout/group";
import { Stack } from "@/components/layout/stack";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Slider } from "@/components/ui/slider";
import { useGetCategories } from "@/features/categories/api/get-categories";
import { useGetTransactionGroups } from "@/features/transaction-groups/api/get-transaction-groups";
import { PaymentMethod } from "@/types/payment-method";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";
import type { TransactionsFilterRequest } from "../types/transactions-filter";
import { DatePickerWithRange } from "./date-picker-range";

interface TransactionFiltersProps {
	filters: TransactionsFilterRequest;
	setFilters: (
		filters: (prev: TransactionsFilterRequest) => TransactionsFilterRequest,
	) => void;
}

const DEBOUNCE_DELAY = 400;
const SLIDER_MIN_VALUE = 0;
const SLIDER_MAX_VALUE = 5000;

export default function TransactionFilters({
	filters,
	setFilters,
}: TransactionFiltersProps) {
	const [subjectSearch, setSubjectSearch] = useState("");
	const [sliderValues, setSliderValues] = useState<number[]>([
		filters.minAmount ?? SLIDER_MIN_VALUE + 1,
		filters.maxAmount ?? SLIDER_MAX_VALUE - 1,
	]);
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
		[],
	);
	const [selectedTransactionGroupIds, setSelectedTransactionGroupIds] =
		useState<number[]>([]);
	const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
		PaymentMethod[]
	>([]);
	const { data: categories } = useGetCategories();
	const { data: transactionGroups } = useGetTransactionGroups();

	const transactionTypeFilter = (type: string) => {
		if (type === "BOTH")
			return setFilters((prev) => ({
				...prev,
				page: 1,
				transactionType: undefined,
			}));
		setFilters((prev) => ({ ...prev, page: 1, transactionType: type }));
	};

	const timeoutRef = useRef<number | null>(null);

	const handleSearchDebounced = (value: string) => {
		setSubjectSearch(value);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = window.setTimeout(() => {
			setFilters((prev) => ({
				...prev,
				page: 1,
				subjectContains: value,
			}));
		}, DEBOUNCE_DELAY);
	};

	const createDateFromFormattedString = (dateString: string | undefined) => {
		if (!dateString) return undefined;
		const [year, month, day] = dateString.split("-").map(Number);
		return new Date(year, month - 1, day);
	};

	const handleSliderChange = (value: number[]) => {
		setSliderValues(value);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = window.setTimeout(() => {
			setFilters((prev) => ({
				...prev,
				page: 1,
				minAmount: value[0] === SLIDER_MIN_VALUE ? undefined : value[0],
				maxAmount: value[1] === SLIDER_MAX_VALUE ? undefined : value[1],
			}));
		}, DEBOUNCE_DELAY);
	};

	const handleCategorySelect = (categoryId: number, checked: boolean) => {
		setSelectedCategoryIds((prev) =>
			checked
				? [...prev, categoryId]
				: prev.filter((id) => id !== categoryId),
		);
		setFilters((prev) => ({
			...prev,
			page: 1,
			categoryIds: checked
				? [...(prev.categoryIds || []), categoryId]
				: prev.categoryIds?.filter((id) => id !== categoryId),
		}));
	};

	const handleTransactionGroupSelect = (
		transactionGroupId: number,
		checked: boolean,
	) => {
		setSelectedTransactionGroupIds((prev) =>
			checked
				? [...prev, transactionGroupId]
				: prev.filter((id) => id !== transactionGroupId),
		);
		setFilters((prev) => ({
			...prev,
			page: 1,
			transactionGroupIds: checked
				? [...(prev.transactionGroupIds || []), transactionGroupId]
				: prev.transactionGroupIds?.filter(
						(id) => id !== transactionGroupId,
					),
		}));
	};

	const handlePaymentMethodSelect = (
		method: PaymentMethod,
		checked: boolean,
	) => {
		setSelectedPaymentMethods((prev) =>
			checked ? [...prev, method] : prev.filter((m) => m !== method),
		);
		setFilters((prev) => ({
			...prev,
			page: 1,
			paymentMethods: checked
				? [...(prev.paymentMethods || []), method]
				: prev.paymentMethods?.filter((m) => m !== method),
		}));
	};

    const handlePageSizeChange = (value: string) => {
        const pageSize = parseInt(value, 10);
        setFilters((prev) => ({
            ...prev,
            page: 1,
            pageSize,
        }));
    }

	const clearFilters = () => {
		setFilters(() => ({
			page: 1,
			pageSize: filters.pageSize,
		}));
		setSubjectSearch("");
		setSliderValues([SLIDER_MIN_VALUE + 1, SLIDER_MAX_VALUE - 1]);
		setSelectedCategoryIds([]);
	};

	return (
		<Stack padding={0}>
			<Group padding={0} className="items-center flex-wrap">
				<InputGroup className="max-w-48">
					<InputGroupInput
						value={subjectSearch}
						onChange={(e) =>
							handleSearchDebounced(e.currentTarget.value)
						}
						id="input-group-url"
						placeholder="Search transactions..."
					/>
					<InputGroupAddon align="inline-start">
						<Search />
					</InputGroupAddon>
				</InputGroup>
				<Typography className="text-xs">Transaction type:</Typography>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
							{filters?.transactionType
								? filters.transactionType
								: "BOTH"}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							value={filters?.transactionType || "BOTH"}
							onValueChange={transactionTypeFilter}
						>
							<DropdownMenuRadioItem value="BOTH">
								Both
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="INCOME">
								Income
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="EXPENSE">
								Expense
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
				<Typography className="text-xs">Date range:</Typography>
				<DatePickerWithRange
					setFilters={setFilters}
					date={{
						from: createDateFromFormattedString(filters.dateFrom),
						to: createDateFromFormattedString(filters.dateTo),
					}}
				/>
				<Button variant="destructive" onClick={clearFilters}>
					<X className="h-4 w-4" />
					Clear filters
				</Button>
				<Group padding={0}>
					<Stack padding={0} gap={0}>
						<Typography className="text-xs">
							Amount range:
						</Typography>
						<Typography className="text-xs">
							{sliderValues[0] === SLIDER_MIN_VALUE
								? "-∞"
								: sliderValues[0]}{" "}
							-{" "}
							{sliderValues[1] === SLIDER_MAX_VALUE
								? "∞"
								: sliderValues[1]}
						</Typography>
					</Stack>
					<Slider
						defaultValue={[SLIDER_MIN_VALUE, SLIDER_MAX_VALUE]}
						max={SLIDER_MAX_VALUE}
						step={10}
						className="w-32"
						value={sliderValues}
						onValueChange={handleSliderChange}
					/>
				</Group>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant={
								selectedCategoryIds.length > 0
									? "secondary"
									: "outline"
							}
						>
							Filter by Category
							{selectedCategoryIds.length > 0
								? ": " +
									categories
										?.filter((c) =>
											selectedCategoryIds.includes(c.id),
										)
										.map((c) => c.icon)
										.join(" ")
								: ""}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-40">
						<DropdownMenuGroup>
							<DropdownMenuLabel>Categories</DropdownMenuLabel>
							{categories?.map((category) => (
								<DropdownMenuCheckboxItem
									key={category.id}
									checked={selectedCategoryIds.includes(
										category.id,
									)}
									onSelect={(e) => e.preventDefault()}
									onCheckedChange={(checked) =>
										handleCategorySelect(
											category.id,
											checked,
										)
									}
								>
									{category.icon} {category.name}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant={
								selectedPaymentMethods.length > 0
									? "secondary"
									: "outline"
							}
						>
							Filter by Payment Method{" "}
							{selectedPaymentMethods.length > 0
								? `(${selectedPaymentMethods.length})`
								: ""}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-40">
						<DropdownMenuGroup>
							<DropdownMenuLabel>Categories</DropdownMenuLabel>
							{Object.values(PaymentMethod)?.map((method, i) => (
								<DropdownMenuCheckboxItem
									key={i}
									checked={selectedPaymentMethods.includes(
										method,
									)}
									onSelect={(e) => e.preventDefault()}
									onCheckedChange={(checked) =>
										handlePaymentMethodSelect(
											method,
											checked,
										)
									}
								>
									{method}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant={
								selectedTransactionGroupIds.length > 0
									? "secondary"
									: "outline"
							}
						>
							Filter by Transaction Group{" "}
							{selectedTransactionGroupIds.length > 0
								? `(${selectedTransactionGroupIds.length})`
								: ""}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-40">
						<DropdownMenuGroup>
							<DropdownMenuLabel>
								Transaction groups
							</DropdownMenuLabel>
							{transactionGroups?.map((group) => (
								<DropdownMenuCheckboxItem
									key={group.id}
									checked={selectedTransactionGroupIds.includes(
										group.id,
									)}
									onSelect={(e) => e.preventDefault()}
									onCheckedChange={(checked) =>
										handleTransactionGroupSelect(
											group.id,
											checked,
										)
									}
								>
									{group.name}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
                            Page size: {filters.pageSize}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuLabel>Page size</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							value={filters.pageSize.toString()}
							onValueChange={handlePageSizeChange}
						>
							<DropdownMenuRadioItem value="10">
							    10	
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="20">
							    20	
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="50">
							    50	
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</Group>
		</Stack>
	);
}
