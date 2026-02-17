import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import type { TransactionsFilterRequest } from "../types/transactions-filter"

interface DateRangePickerProps {
    date: DateRange, 
    setFilters: (filters: (prev: TransactionsFilterRequest) => TransactionsFilterRequest) => void;
}

export function DatePickerWithRange({ date, setFilters }: DateRangePickerProps) {
  const setFilterDate = (range: DateRange | undefined) => {
      const dateFrom = range?.from ? format(range.from, "yyyy-MM-dd") : undefined;
      const dateTo = range?.to ? format(range.to, "yyyy-MM-dd") : undefined;
      setFilters(prev => ({
          ...prev,
          dateFrom,
          dateTo 
      }))
  }

  return (
    <Field className="w-60">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setFilterDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
