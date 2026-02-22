import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface DatePickerSimpleProps {
	children?: React.ReactNode;
	date: Date;
	setDate: (date: Date) => void;
}

export function DatePickerSimple({
	children,
	date,
	setDate,
}: DatePickerSimpleProps) {
	return (
		<Field className="mx-auto">
			<Popover>
				<PopoverTrigger asChild>
					{children ? (
						children
					) : (
						<Button
							variant="outline"
							id="date-picker-simple"
							className="justify-start font-normal"
						>
							{date ? format(date, "PPP") : "Pick a date"}
						</Button>
					)}
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={date}
						onSelect={(date) => {
							if (date) {
								const normalizedDate = new Date(date);
								normalizedDate.setHours(12, 0, 0, 0);
								setDate(normalizedDate);
							}
						}}
						defaultMonth={date}
					/>
				</PopoverContent>
			</Popover>
		</Field>
	);
}
