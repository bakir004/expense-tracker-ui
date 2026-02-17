import { Typography } from "@/components/common/typography";
import { Stack } from "@/components/layout/stack";
import TransactionsList from "@/features/transactions/components/transactions-list";

export default function Home() {
    return <Stack gap={4}>
        <Typography variant="h3">Dashboard Home</Typography>
        <Typography>Welcome to your dashboard! Here you can see an overview of your financial activities.</Typography>
        <TransactionsList />
    </Stack>;
}
