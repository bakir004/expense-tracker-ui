import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
	Dialog,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { TransactionPopulated } from "@/types/transaction";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Group } from "@/components/layout/group";
import { Stack } from "@/components/layout/stack";
import { toast } from "sonner";

interface CreateTransactionGroupDialogProps {
    children?: React.ReactNode;
    transaction: TransactionPopulated;
    updateTransaction: (transaction: TransactionPopulated) => void;
    readonly?: boolean;
}

export default function EditAmountDialog({ children, transaction, updateTransaction, readonly }: CreateTransactionGroupDialogProps) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState<string>(transaction.amount.toString());
    const [transactionType, setTransactionType] = useState(transaction.transactionType);

    const submit = () => {
        const parsedAmount = parseFloat(amount);
        if(isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error("Amount must be a non negative number");
            return;
        }
        updateTransaction({
            ...transaction,
            amount: parsedAmount,
            transactionType
        });
        setOpen(false);
    }

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger disabled={readonly}>
                {children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-lg">
					    Edit transaction amount	
					</DialogTitle>
                    <Group padding={0} gap={2}>
                        <Stack padding={0} gap={2}>
                            <Label>Type</Label>
                            <Select name="type" value={transactionType} onValueChange={(value) => setTransactionType(value as typeof transactionType)}>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Transaction type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="EXPENSE">Expense</SelectItem>
                                        <SelectItem value="INCOME">Income</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Stack>
                        <Stack padding={0} gap={2} className="w-full">
                            <Label htmlFor="amount-1">Amount</Label>
                            <Input
                                id="amount-1"
                                name="amount"
                                type="number"
                                value={amount}
                                placeholder="E.g. 420"
                                onChange={(e) => setAmount(e.target.value)}
                                maxLength={10}
                            />
                        </Stack>
                    </Group>
					<DialogDescription>
                        Amount must be non negative
					</DialogDescription>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button onClick={submit} type="submit">Submit</Button>
					</DialogFooter>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
