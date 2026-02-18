import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransactionsTableSkeleton({ count = 10 }: { count?: number }) {
    return (
        <Table>
            <TableCaption>Loading data...</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-3/12">
                        <Button variant="ghost">
                            Subject
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
                    <TableHead className="w-2/12">
                        <Button variant="ghost">
                            Date 
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
                    <TableHead className="w-2/12">
                        <Button variant="ghost">
                            Category 
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
                    <TableHead className="w-1/12">
                        <Button variant="ghost">
                            Transaction group 
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
                    <TableHead className="w-1/12">
                        <Button variant="ghost">
                            Payment method 
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
                    <TableHead className="w-1/12 text-right">
                        <Button variant="ghost">
                            Amount 
                            <ArrowUpDown className="h-2 w-2" />
                        </Button>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: count }).map((_, i: number) => (
                    <TableRow key={i} className="h-13">
                        <TableCell className="flex flex-col gap-1">
                            <Skeleton className="w-3/4 h-4 rounded" />
                            <Skeleton className="w-2/4 h-3 rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="w-2/4 h-4 rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="w-4/6 h-4 rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="w-3/4 h-4 rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="w-4/6 h-4 rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="w-full h-4 rounded" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
