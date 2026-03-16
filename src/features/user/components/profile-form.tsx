import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Typography } from "@/components/common/typography";
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

import { useAuth } from "@/lib/auth-provider";
import { useUpdateUserProfile } from "../api/update-user";
import type { ErrorResponse } from "@/types/error";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(255, "Name must be less than 255 characters.")
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .email("Please enter a valid email address.")
      .optional()
      .or(z.literal("")),
    currentPassword: z
      .string()
      .min(8, "Current password is required and must be at least 8 characters.")
      .max(255, "Password must be less than 255 characters."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(255, "Password must be less than 255 characters.")
      .optional()
      .or(z.literal("")),
    newPasswordAgain: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(255, "Password must be less than 255 characters.")
      .optional()
      .or(z.literal("")),
    initialBalance: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) =>
      !data.newPassword &&
      !data.newPasswordAgain ||
      data.newPassword === data.newPasswordAgain,
    {
      message: "New passwords must match",
      path: ["newPasswordAgain"],
    },
  );

export default function ProfileForm() {
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      currentPassword: "",
      newPassword: "",
      newPasswordAgain: "",
      initialBalance:
        user?.initialBalance != null
          ? user.initialBalance.toString()
          : "",
    },
  });

  const { mutate: updateProfile, isPending } = useUpdateUserProfile();

  function onSubmit(data: z.infer<typeof formSchema>) {
    let initialBalance: number | null = null;
    if (data.initialBalance && data.initialBalance.trim() !== "") {
      initialBalance = parseFloat(data.initialBalance);
      if (isNaN(initialBalance)) {
        form.setError("initialBalance", {
          type: "manual",
          message: "Initial balance must be a number.",
        });
        return;
      }
    }

    const payload = {
      currentPassword: data.currentPassword,
      name: data.name && data.name.trim() !== "" ? data.name : undefined,
      email:
        data.email && data.email.trim() !== "" ? data.email : undefined,
      newPassword:
        data.newPassword && data.newPassword.trim() !== ""
          ? data.newPassword
          : undefined,
      initialBalance,
    };

    updateProfile(payload, {
      onSuccess: () => {
        toast.success("Profile updated successfully!", {
          description: "Your profile changes have been saved.",
        });
        form.reset({
          ...data,
          currentPassword: "",
          newPassword: "",
          newPasswordAgain: "",
          initialBalance:
            initialBalance !== null
              ? initialBalance.toString()
              : data.initialBalance ?? "",
        });
      },
      onError: (error: ErrorResponse) => {
        const validationMessages = error.errors
          ? Object.values(error.errors).flat().join(", ")
          : "";

        toast.error("Profile update failed!", {
          description:
            validationMessages ||
            error.detail ||
            error.title ||
            "An unexpected error occurred. Please try again.",
        });
      },
    });
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your personal information and account settings.
          </CardDescription>
        </div>
        <ThemeToggle />
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={onSubmit} />
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <Button
          disabled={isPending}
          type="submit"
          className="w-full md:w-auto"
          form="profile-form"
        >
          Save changes
          {isPending && <Loader2 className="ml-2 animate-spin" />}
        </Button>
        <Typography className="text-xs text-muted-foreground md:text-right">
          For any changes to be saved, you must enter your current password.
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
    <form
      id="profile-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FieldGroup className="grid gap-6 md:grid-cols-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-form-name">
                Name
              </FieldLabel>
              <Input
                {...field}
                id="profile-form-name"
                aria-invalid={fieldState.invalid}
                placeholder="John Doe"
                autoComplete="off"
              />
              <FieldDescription>
                Leave blank to keep your current name.
              </FieldDescription>
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
              <FieldLabel htmlFor="profile-form-email">
                Email
              </FieldLabel>
              <Input
                {...field}
                id="profile-form-email"
                aria-invalid={fieldState.invalid}
                placeholder="john.doe@email.com"
                autoComplete="off"
              />
              <FieldDescription>
                Leave blank to keep your current email.
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-form-current-password">
                Current password
              </FieldLabel>
              <Input
                {...field}
                id="profile-form-current-password"
                aria-invalid={fieldState.invalid}
                placeholder="********"
                autoComplete="off"
                type="password"
              />
              <FieldDescription>
                Required to confirm any changes.
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-form-new-password">
                New password
              </FieldLabel>
              <Input
                {...field}
                id="profile-form-new-password"
                aria-invalid={fieldState.invalid}
                placeholder="********"
                autoComplete="off"
                type="password"
              />
              <FieldDescription>
                Leave blank if you don&apos;t want to change
                your password.
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="newPasswordAgain"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-form-new-password-again">
                New password again
              </FieldLabel>
              <Input
                {...field}
                id="profile-form-new-password-again"
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
              <FieldLabel htmlFor="profile-form-initial-balance">
                Initial balance
              </FieldLabel>
              <Input
                {...field}
                id="profile-form-initial-balance"
                aria-invalid={fieldState.invalid}
                onChange={(e) =>
                  field.onChange(e.target.value)
                }
                placeholder="0"
                autoComplete="off"
              />
              <FieldDescription>
                Leave blank to keep your current balance.
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

