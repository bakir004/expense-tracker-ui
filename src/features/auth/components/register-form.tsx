import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRegister } from "../api/register.ts";
import type { AuthErrorResponse } from "../types/common.ts";

import { Typography } from "@/components/common/typography.tsx";
import { Link } from "react-router-dom";

const formSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters.")
            .max(255, "Name must be less than 255 characters."),
        email: z.email("Please enter a valid email address."),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters.")
            .max(255, "Password must be less than 255 characters."),
        passwordAgain: z
            .string()
            .min(8, "Password must be at least 8 characters.")
            .max(255, "Password must be less than 255 characters."),
        initialBalance: z.number(),
    })
    .refine((data) => data.password === data.passwordAgain, {
        message: "Passwords must match",
        path: ["passwordAgain"],
    });

export default function RegisterForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordAgain: "",
            initialBalance: 0,
        },
    });

    const { mutate: register, isPending } = useRegister();
    const navigate = useNavigate();

    function onSubmit(data: z.infer<typeof formSchema>) {
        register(data, {
            onSuccess: () => {
                toast.success("Register successful!", {
                    description: "You can now log in with your new account.",
                });
                navigate("/login");
            },
            onError: (error: AuthErrorResponse) => {
                toast.error("Register failed!", {
                    description:
                        error.title ||
                        "An unexpected error occurred. Please try again.",
                });
            },
        });
    }

    return (
        <Card className="w-full sm:max-w-xs">
            <CardHeader className="text-center">
                <CardTitle>Welcome to Expense Tracker!</CardTitle>
                <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form form={form} onSubmit={onSubmit} />
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-4">
                <Field orientation="horizontal">
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="grow"
                        form="register-form"
                    >
                        Submit
                        {isPending && <Loader2 className="animate-spin" />}
                    </Button>
                    <ThemeToggle />
                </Field>
                <Typography className="text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="underline hover:text-foreground"
                    >
                        Login here
                    </Link>
                </Typography>
            </CardFooter>
        </Card>
    );
}

function Form({
    form,
    onSubmit,
}: {
    form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
    onSubmit: (data: z.infer<typeof formSchema>) => void;
}) {
    return (
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="register-form-name">
                                Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="register-form-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="John Doe"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="register-form-email">
                                Email
                            </FieldLabel>
                            <Input
                                {...field}
                                id="register-form-email"
                                aria-invalid={fieldState.invalid}
                                placeholder="john.doe@email.com"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="register-form-password">
                                Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id="register-form-password"
                                aria-invalid={fieldState.invalid}
                                placeholder="********"
                                autoComplete="off"
                                type="password"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="passwordAgain"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="register-form-password-again">
                                Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id="register-form-password-again"
                                aria-invalid={fieldState.invalid}
                                placeholder="********"
                                autoComplete="off"
                                type="password"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="initialBalance"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="register-form-initial-balance">
                                Initial Balance
                            </FieldLabel>
                            <Input
                                {...field}
                                id="register-form-initial-balance"
                                aria-invalid={fieldState.invalid}
                                onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber)
                                }
                                placeholder="0"
                                autoComplete="off"
                            />
                            <FieldDescription>
                                Initial balance can be changed later
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
        </form>
    );
}
