import { useNavigate } from "react-router-dom";
import { Pie, PieChart, Cell, Legend } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
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
import { useGetTransactionsByCategoryChartData } from "../api/get-by-category-chart-data";
import { useGetCategories } from "@/features/categories/api/get-categories";
import { useMemo } from "react";

const COLORS = [
    "#3b82f6", // Blue 500
    "#10b981", // Emerald 500
    "#f59e0b", // Amber 500
    "#ef4444", // Red 500
    "#8b5cf6", // Violet 500
    "#06b6d4", // Cyan 500
    "#f97316", // Orange 500
    "#ec4899", // Pink 500
    "#6366f1", // Indigo 500
    "#84cc16", // Lime 500
    "#14b8a6", // Teal 500
    "#f43f5e", // Rose 500
];

export function TransactionsByCategoryChart() {
    const navigate = useNavigate();
    const { data, isLoading: isChartLoading } = useGetTransactionsByCategoryChartData();
    const { data: categories, isLoading: isCatsLoading } = useGetCategories();

    const formattedData = useMemo(() => {
        if (!data?.chartData) return [];

        const categoryMap = new Map(
            categories?.map((cat) => [cat.id, cat.name])
        );

        return data.chartData
            .sort((a, b) => b.netExpenses - a.netExpenses)
            .map((item, index) => ({
                categoryId: item.categoryId,
                categoryName: item.categoryId 
                    ? categoryMap.get(item.categoryId) || "Unknown Category" 
                    : "Uncategorized",
                amount: item.netExpenses,
                fill: COLORS[index % COLORS.length],
            }));
    }, [data, categories]);

    const chartConfig = {
        amount: { label: "Total Spent" },
    } satisfies ChartConfig;

    const handlePieClick = (id: number) => {
        const params = new URLSearchParams();
        if (id) {
            params.set("categoryIds", id.toString());
        } else {
            params.set("uncategorized", "true");
        }
        navigate(`/dashboard?${params.toString()}`);
    };

    if (isChartLoading || isCatsLoading)
        return (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                Loading Chart...
            </div>
        );

    return (
        <Card className="flex flex-col grow">
            <CardHeader className="items-center pb-0">
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>
                    Click a slice to view transactions
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={formattedData}
                            dataKey="amount"
                            nameKey="categoryName"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            strokeWidth={2}
                            onClick={(state) => {
                                handlePieClick(state.categoryId);
                            }}
                            style={{ cursor: "pointer", outline: "none" }}
                        >
                            {formattedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                            ))}
                        </Pie>
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            layout="horizontal"
                            wrapperStyle={{ paddingTop: "20px" }}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm" />
        </Card>
    );
}
