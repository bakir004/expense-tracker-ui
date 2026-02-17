import { Stack } from "@/components/layout/stack";
import { useGetTransactions } from "../api/get-transactions";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { ShieldAlertIcon } from "lucide-react";

export default function TransactionsList() {
    const { data: transactions, isLoading, error } = useGetTransactions({});

    return <Stack gap={4} padding={0}>
        {isLoading && <p>Loading transactions...</p>}
        {transactions?.map((transaction, i) => (
            <Item variant="outline" key={i}>
                <ItemMedia variant="icon">
                    <ShieldAlertIcon />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>{transaction.subject}</ItemTitle>
                    <ItemDescription>
                        Amount: {transaction.amount} {transaction.transactionType}
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                <Button size="sm" variant="outline">
                    Review
                </Button>
                </ItemActions>
            </Item>
        ))}
        {error && <p>Error loading transactions: {error.title} {Object.keys(error.errors).map((key) => {
                return <span>{key}: {error.errors[key].join(", ")}</span>;
        })}</p>}
    </Stack>;
}
