import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Dialog,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useCreateTransaction } from "../api/create-transaction";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { TransactionType } from "@/types/transaction-type";
import { PaymentMethod } from "@/types/payment-method";
import { Textarea } from "@/components/ui/textarea";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { Group } from "@/components/layout/group";
import { DatePickerSimple } from "./date-picker";
import { useGetCategories } from "@/features/categories/api/get-categories";
import { useGetTransactionGroups } from "@/features/transaction-groups/api/get-transaction-groups";

const formSchema = z.object({
	subject: z
		.string()
		.min(1, "Subject is required")
		.max(255, "Subject must be less than 255 characters"),
	notes: z
		.string()
		.max(255, "Notes must be less than 255 characters")
		.optional(),
	amount: z.string().refine(
		(value) => {
			const numberValue = Number(value);
			return !isNaN(numberValue) && numberValue > 0;
		},
		{
			message: "Amount must be a positive number",
		},
	),
	transactionType: z.enum(
		Object.values(TransactionType) as [string, ...string[]],
		{
			error: "Transaction type must be either INCOME or EXPENSE",
		},
	),
	categoryId: z.string().nullable(),
	transactionGroupId: z.string().nullable(),
	paymentMethod: z.enum(
		Object.values(PaymentMethod) as [string, ...string[]],
		{
			error: `Payment method must be one of the following: ${Object.values(PaymentMethod).join(", ")}`,
		},
	),
	date: z.date(),
});

export default function CreateTransactionDialog({
	children,
}: {
	children: React.ReactNode;
}) {
	const { mutate: createTransaction, isPending } = useCreateTransaction();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			subject: "",
			notes: "",
			amount: "0",
			transactionType: "EXPENSE",
			categoryId: null,
			transactionGroupId: null,
			paymentMethod: "CASH",
			date: new Date(),
		},
	});
	const [open, setOpen] = useState(false);

	function onSubmit(data: z.infer<typeof formSchema>) {
		const transactionData = {
			...data,
			amount: Number(data.amount),
			transactionType: data.transactionType as TransactionType,
			paymentMethod: data.paymentMethod as PaymentMethod,
			categoryId: Number(data.categoryId) || null,
			transactionGroupId: Number(data.transactionGroupId) || null,
			date: data.date.toISOString().split("T")[0],
		};
        form.reset();
		createTransaction(transactionData);
        setOpen(false);
	}

    useEffect(() => {
        form.clearErrors();
    }, [form]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle className="text-lg">
						Create a transaction
					</DialogTitle>
					<Form form={form} onSubmit={onSubmit} />
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button
							disabled={isPending}
							type="submit"
							className="grow"
							form="create-transaction-form"
						>
							Submit
							{isPending && <Loader2 className="animate-spin" />}
						</Button>
					</DialogFooter>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

function Form({
	form,
	onSubmit,
}: {
	form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
	onSubmit: (data: z.infer<typeof formSchema>) => void;
}) {
    const { data: categories } = useGetCategories();
    const { data: transactionGroups } = useGetTransactionGroups();

	return (
		<form
			id="create-transaction-form"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<FieldGroup className="gap-2">
				<Controller
					name="subject"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="create-transaction-form-subject">
								Subject
							</FieldLabel>
							<Input
								{...field}
								id="create-transaction-form-subject"
								aria-invalid={fieldState.invalid}
								placeholder="E.g. Salary, Grocery, etc."
								autoComplete="off"
							/>
							{fieldState.invalid && (
								<FieldError className="-mt-1.5" errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>
				<Controller
					name="notes"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="create-transaction-form-notes">
								Notes (optional)
							</FieldLabel>
							<Textarea
								{...field}
								id="create-transaction-form-notes"
								aria-invalid={fieldState.invalid}
								placeholder="E.g. Received salary for June, Bought groceries at Walmart, etc."
								autoComplete="off"
							/>
						</Field>
					)}
				/>
                <Group padding={0} gap={4} className="w-full">
                    <Controller
                        name="amount"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="create-transaction-form-amount">
                                    Amount
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="create-transaction-form-amount"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="E.g. 1000"
                                    autoComplete="off"
                                />
                                <FieldDescription className="!-mt-1.5">
                                    Must be positive
                                </FieldDescription>
                                {fieldState.invalid && (
                                    <FieldError className="-mt-2" errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="transactionType"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>
                                    Transaction Type
                                </FieldLabel>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger
                                        id="create-transaction-form-transaction-type"
                                        aria-invalid={fieldState.invalid}
                                        className="min-w-[120px]"
                                    >
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        <SelectItem value="INCOME">
                                            Income
                                        </SelectItem>
                                        <SelectItem value="EXPENSE">
                                            Expense
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    />
                </Group>
                <Group padding={0} gap={4} className="w-full">
                    <Controller
                        name="date"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>
                                    Date
                                </FieldLabel>
                                <DatePickerSimple 
                                    date={field.value} 
                                    setDate={field.onChange}
                                />
                            </Field>
                        )}
                    />
                    <Controller
                        name="paymentMethod"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="create-transaction-form-payment-method">
                                    Payment Method
                                </FieldLabel>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger
                                        id="create-transaction-form-payment-method"
                                        aria-invalid={fieldState.invalid}
                                        className="min-w-[120px]"
                                    >
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        {Object.values(PaymentMethod).map((method) => {
                                            const label = method
                                                .replace(/_/g, " ")
                                                .toLowerCase()
                                                .replace(/\b\w/g, (char) => char.toUpperCase());
                                            return <SelectItem className="capitalize" key={method} value={method}>
                                                {label}
                                            </SelectItem>})
                                        }
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    />
                </Group>
                <Group padding={0} gap={4} className="w-full mb-3">
                    <Controller
                        name="categoryId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="create-transaction-form-category-id">
                                    Category
                                </FieldLabel>
                                <Select
                                    name={field.name}
                                    value={field.value || ""}
                                    onValueChange={(value) =>
                                        field.onChange(value === "" ? null : value)
                                    }
                                    defaultValue={"NONE"}
                                >
                                    <SelectTrigger
                                        id="create-transaction-form-category-id"
                                        aria-invalid={fieldState.invalid}
                                        className="min-w-[120px]"
                                    >
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        <SelectItem className="py-1 italic" value={"NONE"}>
                                            None
                                        </SelectItem>
                                        {categories?.map((category) => (
                                            <SelectItem className="py-1" key={category.id} value={category.id.toString()}>
                                                {category.icon} {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    />
                    <Controller
                        name="transactionGroupId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="create-transaction-form-transaction-group-id">
                                    Transaction Group
                                </FieldLabel>
                                <Select
                                    name={field.name}
                                    value={field.value || ""}
                                    onValueChange={(value) =>
                                        field.onChange(value === "" ? null : value)
                                    }
                                    defaultValue={"NONE"}
                                >
                                    <SelectTrigger
                                        id="create-transaction-form-transaction-group-id"
                                        aria-invalid={fieldState.invalid}
                                        className="min-w-[120px]"
                                    >
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                        <SelectItem className="py-1 italic" value={"NONE"}>
                                            None
                                        </SelectItem>
                                        {transactionGroups?.map((group) => (
                                            <SelectItem key={group.id} value={group.id.toString()}>
                                                {group.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    />
                </Group>
			</FieldGroup>
		</form>
	);
}
