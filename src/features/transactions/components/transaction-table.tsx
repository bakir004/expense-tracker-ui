import { Typography } from "@/components/common/typography";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TransactionsWithPagingMetadata } from "../types/transaction-response";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TransactionTableProps {
    data: TransactionsWithPagingMetadata;
}

export default function TransactionTable({ data }: TransactionTableProps) {
    const sgn = (n: number) => n < 0 ? '-' : '+';
    const formatAmount = (amount: number) => `${sgn(amount)}$${Math.abs(amount)}`;
    const formatPaymentMethod = (method: string) => method.replace("_", " ").toLowerCase();;

    return <ScrollArea className="whitespace-nowrap">
        <Table>
            <TableCaption>Showing {(data.currentPage-1) * data.pageSize+(data.transactions.length > 0 ? 1 : 0)}
                -{(data.currentPage-1) * data.pageSize + data.transactions.length} of {data.totalCount} transactions
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-3/12">Subject</TableHead>
                    <TableHead className="w-2/12">Date</TableHead>
                    <TableHead className="w-2/12">Category</TableHead>
                    <TableHead className="w-1/12">Transaction group</TableHead>
                    <TableHead className="w-1/12">Payment method</TableHead>
                    <TableHead className="w-1/12 text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.transactions.map((transaction, i: number) => (
                    <TableRow key={i} className="h-13">
                        <TableCell className="font-medium">
                            {transaction.subject}<br/>
                            <Typography className="text-muted-foreground font-light text-xs mt-0.5">{transaction.notes}</Typography>
                        </TableCell>
                        <TableCell>{new Intl.DateTimeFormat("en-GB").format(transaction.date)}</TableCell>
                        <TableCell>{transaction.category ? `${transaction.category.icon} ${transaction.category.name}` : '-'}</TableCell>
                        <TableCell>{transaction.transactionGroup?.name ?? '-'}</TableCell>
                        <TableCell className="capitalize">{formatPaymentMethod(transaction.paymentMethod)}</TableCell>
                        <TableCell className={cn("text-right", transaction.signedAmount < 0 ? "text-destructive" : "text-primary")}>
                            {formatAmount(transaction.signedAmount)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
       <ScrollBar orientation="horizontal" />
    </ScrollArea>;
}
