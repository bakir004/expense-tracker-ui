import { Typography } from "@/components/common/typography";
import { Stack } from "@/components/layout/stack";
import TransactionFilterTable from "@/features/transactions/components/transaction-filter-table";

export default function Home() {
    return <Stack gap={4}>
        <Typography variant="h3">Dashboard Home</Typography>
        <Typography>Welcome to your dashboard! Here you can see an overview of your financial activities.</Typography>
        <TransactionFilterTable />
    </Stack>;
}
