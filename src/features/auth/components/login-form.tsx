import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Typography } from "@/components/common/typography.tsx";
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
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useLogin } from "../api/login";
import type { AuthErrorResponse } from "../types/common.ts";

const formSchema = z.object({
    email: z.email("Please enter a valid email address."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(255, "Password must be less than 255 characters."),
});

export default function LoginForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutate: login, isPending } = useLogin();
    const navigate = useNavigate();

    function onSubmit(data: z.infer<typeof formSchema>) {
        login(data, {
            onSuccess: () => {
                toast.success("Login successful!");
                navigate("/dashboard");
            },
            onError: (error: AuthErrorResponse) => {
                toast.error("Login failed!", {
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
                <CardDescription>Login to your account</CardDescription>
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
                        form="login-form"
                    >
                        Submit
                        {isPending && <Loader2 className="animate-spin" />}
                    </Button>
                    <ThemeToggle />
                </Field>
                <Typography className="text-xs text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="underline hover:text-foreground"
                    >
                        Register here
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
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="login-form-email">
                                Email
                            </FieldLabel>
                            <Input
                                {...field}
                                id="login-form-email"
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
                            <FieldLabel htmlFor="login-form-password">
                                Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id="login-form-password"
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
            </FieldGroup>
        </form>
    );
}
