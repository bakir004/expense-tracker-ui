import { Typography } from "@/components/common/typography";
import TransactionFilterTable from "@/features/transactions/components/transaction-filter-table";

export default function Home() {
    return (
        <>
            <Typography className="mt-4" variant="h3">Dashboard Home</Typography>
            <Typography>
                Welcome to your dashboard! Here you can see an overview of your
                financial activities.
            </Typography>
            <TransactionFilterTable />
        </>
    );
}
