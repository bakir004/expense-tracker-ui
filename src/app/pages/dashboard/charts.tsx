import { Typography } from "@/components/common/typography";
import { TransactionsByCategoryChart } from "@/features/transactions/components/transaction-category-chart";
import { TransactionNetChart } from "@/features/transactions/components/transaction-net-chart";
import { Group } from "@/components/layout/group";

export default function Charts() {
    return (
        <>
            <Typography className="mt-4" variant="h3">Dashboard Charts</Typography>
            <Typography>
                This is the charts page. Here you can visualize your financial data with various charts and graphs.
            </Typography>
            <Group padding={0}>
                <TransactionNetChart />
                <TransactionsByCategoryChart />
            </Group>
        </>
    );
}
