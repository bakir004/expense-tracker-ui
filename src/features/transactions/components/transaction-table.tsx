import { Typography } from "@/components/common/typography";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TransactionsWithPagingMetadata } from "../types/transaction-response";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface TransactionTableProps {
    data: TransactionsWithPagingMetadata;
    sort: (field: string) => void;
}

export default function TransactionTable({ data, sort }: TransactionTableProps) {
    const sgn = (n: number) => n < 0 ? '-' : '+';
    const formatAmount = (amount: number) => `${sgn(amount)}$${Math.abs(amount)}`;
    const formatPaymentMethod = (method: string) => method.replace("_", " ").toLowerCase();;

    return <ScrollArea className="whitespace-nowrap">
        <Table>
            <TableCaption>Showing {(data.currentPage-1) * data.pageSize+(data.transactions.length > 0 ? 1 : 0)}
                -{(data.currentPage-1) * data.pageSize + data.transactions.length} of {data.totalCount} transactions
            </TableCaption>
            <TableHeader className="bg-card">
                <TableRow>
                    <TableHead className="w-3/12">
                        <Button variant="ghost" onClick={() => sort('subject')}>
                            Subject
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
                    <TableHead className="w-2/12">
                        <Button variant="ghost" onClick={() => sort('date')}>
                            Date 
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
                    <TableHead className="w-2/12">
                        <Button variant="ghost" onClick={() => sort('categoryId')}>
                            Category 
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
                    <TableHead className="w-1/12">
                        <Button variant="ghost" onClick={() => sort('transactionGroupId')}>
                            Transaction group 
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
                    <TableHead className="w-1/12">
                        <Button variant="ghost" onClick={() => sort('paymentMethod')}>
                            Payment method 
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
                    <TableHead className="w-1/12 text-right">
                        <Button variant="ghost" onClick={() => sort('amount')}>
                            Amount 
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
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
