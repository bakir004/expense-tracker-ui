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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateTransactionGroup } from "../api/create-transaction-group";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { CreateTransactionGroupRequest } from "../types/transaction-group";

interface CreateTransactionGroupDialogProps {
    children?: React.ReactNode;
}

export default function CreateTransactionGroupDialog({ children }: CreateTransactionGroupDialogProps) {
    const { mutate: createTransactionGroup } = useCreateTransactionGroup();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);

    const submit = () => {
        if(!name.trim()) {
            toast.error("Transaction group name cannot be empty.");
            return;
        }
        const newTransactionGroup: CreateTransactionGroupRequest = {
            name: name.trim(),
            description: description.trim() || undefined,
        };
        createTransactionGroup(newTransactionGroup, {
            onSuccess: () => {
                setOpen(false);
                setName("");
                setDescription("");
            },
            onError: (error) => {
                toast.error(`Failed to create transaction group: ${error.title || "Unknown error"}`);
            }
        });
    }

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="text-xs text-primary w-full flex gap-2 items-center py-1 px-2 hover:bg-muted cursor-pointer">
                {children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-lg">
						Create a new transaction group
					</DialogTitle>
					<FieldGroup>
						<Field>
                            <Label htmlFor="name-1">Name</Label>
							<Input
								id="name-1"
								name="name"
								placeholder="E.g. Grocery shopping"
                                onChange={(e) => setName(e.target.value)}
                                maxLength={50}
							/>
						</Field>
						<Field>
                            <Label htmlFor="description-1">Description (optional)</Label>
							<Textarea
								id="description-1"
								name="description"
								placeholder="E.g. All transactions related to grocery shopping"
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={255}
							/>
						</Field>
					</FieldGroup>
					<DialogDescription>
						After creating the transaction group, you can select it
						from the dropdown menu.
					</DialogDescription>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button onClick={submit} type="submit">Create</Button>
					</DialogFooter>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
