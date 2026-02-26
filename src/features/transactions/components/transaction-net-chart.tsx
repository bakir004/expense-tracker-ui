import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { format, subDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { DatePickerWithRange } from "./date-picker-range";
import { useGetTransactionsNetChartData } from "../api/get-net-chart-data";
import type { TransactionNetChartData } from "../types/transaction-net-chart-data";
import { Typography } from "@/components/common/typography";
import { Group } from "@/components/layout/group";

const chartConfig = {
	netIncome: { label: "Income", color: "var(--chart-1)" },
	netExpenses: { label: "Expenses", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface ChartDataPoint {
	date: string;
	netExpenses: number;
	netIncome: number;
	netAmount: number;
	transactions: TransactionNetChartData["transactions"];
}

export function TransactionNetChart() {
	const navigate = useNavigate();
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: subDays(new Date(), 30),
		to: new Date(),
	});

	const dateFrom = dateRange?.from
		? format(dateRange.from, "yyyy-MM-dd")
		: "";
	const dateTo = dateRange?.to
		? format(dateRange.to, "yyyy-MM-dd")
		: dateFrom;

	const { data } = useGetTransactionsNetChartData({ dateFrom, dateTo });

	const chartData = data?.chartData.map((item: TransactionNetChartData) => ({
		date: item.date,
		netExpenses: Math.abs(item.netExpenses),
		netIncome: item.netIncome,
		netAmount: item.netAmount,
		transactions: item.transactions,
	}));

	const handleBarClick = (data: ChartDataPoint) => {
		if (data && data.date) {
			const params = new URLSearchParams({
				dateFrom: data.date,
				dateTo: data.date,
			});
			navigate(`/dashboard?${params.toString()}`);
		}
	};
    const totals = chartData?.reduce(
        (acc, day) => {
            acc.income += day.netIncome;
            acc.expenses += day.netExpenses;
            acc.net += day.netAmount;
            return acc;
        },
        { income: 0, expenses: 0, net: 0 }
    ) || { income: 0, expenses: 0, net: 0 };

    return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
				<CardTitle>Transactions Net Balance</CardTitle>
				<DatePickerWithRange
					date={dateRange as DateRange}
					setDate={(date) => {
						setDateRange(date);
					}}
				/>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart
						accessibilityLayer
						data={chartData}
						onClick={(state) => {
							if (state && state.activePayload)
								handleBarClick(state.activePayload[0].payload);
						}}
						style={{ cursor: "pointer" }}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => {
								try {
									return format(new Date(value), "MMM dd");
								} catch {
									return value;
								}
							}}
						/>
						<ChartTooltip
							cursor={true}
							content={<ChartTooltipContent indicator="dashed" />}
						/>
						<Bar
							dataKey="netExpenses"
							fill="var(--color-netExpenses)"
							radius={4}
						/>
						<Bar
							dataKey="netIncome"
							fill="var(--color-netIncome)"
							radius={4}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-1 text-sm">
                <Typography className="text-foreground text-xs">
                    For this range:
                </Typography>
				<Group padding={0} className="w-full">
                    <Typography className="text-muted-foreground text-xs">
                        Total Income: <span className="text-primary">{totals.income > 0 ? "+" : ""}{totals.income.toFixed(2)}</span>
                    </Typography>
                    <Typography className="text-muted-foreground text-xs">
                        Total Expenses: <span className="text-destructive">-{totals.expenses.toFixed(2)}</span>
                    </Typography>
                    <Typography className="text-muted-foreground text-xs">
                        Net Total: <span className={totals.net >= 0 ? "text-primary" : "text-destructive"}>{totals.net > 0 ? "+" : ""}{totals.net.toFixed(2)}</span>
                        {totals.net >= 0 ? (
                            <TrendingUp className="inline-block ml-1 size-4 text-primary" />
                        ) : (
                            <TrendingDown className="inline-block ml-1 size-4 text-destructive" />
                        )}
                    </Typography>
				</Group>
			</CardFooter>
		</Card>
	);
}
