import { Typography } from "@/components/common/typography";
import { Group } from "@/components/layout/group";
import { Stack } from "@/components/layout/stack";
import type { TransactionsFilterRequest } from "../types/transactions-filter";
import { DatePickerWithRange } from "./date-picker-range";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";

interface TransactionFiltersProps {
    filters: TransactionsFilterRequest;
    setFilters: (filters: (prev: TransactionsFilterRequest) => TransactionsFilterRequest) => void;
}

const DEBOUNCE_DELAY = 400;

export default function TransactionFilters({ filters, setFilters }: TransactionFiltersProps) {
    const [subjectSearch, setSubjectSearch] = useState("");
    const transactionTypeFilter = (type: string) => {
        if (type === "BOTH") {
            return setFilters((prev) => ({ ...prev, page: 1, transactionType: undefined }));
        }
        setFilters((prev) => ({ ...prev, page: 1, transactionType: type }));
    }

    const timeoutRef = useRef<number | null>(null);

    const handleSearchDebounced = (value: string) => {
        setSubjectSearch(value);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            setFilters((prev) => ({ ...prev, page: 1, subjectContains: value }));
        }, DEBOUNCE_DELAY);
    };

    const createDateFromFormattedString = (dateString: string | undefined) => {
        if(!dateString) return undefined;
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const clearFilters = () => {
        setFilters(() => ({
            page: 1,
            pageSize: filters.pageSize,
        }))
        setSubjectSearch("");
    }

    return (
        <Stack padding={0}>
            <Group padding={0} className="items-center flex-wrap">
                <InputGroup className="max-w-48">
                    <InputGroupInput value={subjectSearch} onChange={(e) => handleSearchDebounced(e.currentTarget.value)} id="input-group-url" placeholder="Search transactions..." />
                    <InputGroupAddon align="inline-start">
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
                <Typography className="text-xs">Transaction type:</Typography>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {filters?.transactionType ? filters.transactionType : "BOTH"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup 
                      value={filters?.transactionType || "BOTH"} 
                      onValueChange={transactionTypeFilter}
                    >
                      <DropdownMenuRadioItem value="BOTH">Both</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="INCOME">Income</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="EXPENSE">Expense</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Typography className="text-xs">Date range:</Typography>
                <DatePickerWithRange 
                    setFilters={setFilters} 
                    date={{from: createDateFromFormattedString(filters.dateFrom), 
                        to: createDateFromFormattedString(filters.dateTo)}}
                />
                <Button variant="destructive" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                    Clear filters
                </Button>
            </Group>
        </Stack>
    )
}
