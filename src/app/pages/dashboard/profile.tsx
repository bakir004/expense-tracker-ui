import { Typography } from "@/components/common/typography";
import { Stack } from "@/components/layout/stack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-provider";
import ProfileForm from "@/features/user/components/profile-form";

export default function Profile() {
    const { user } = useAuth();

    return (
        <>
            <Typography className="mt-4" variant="h3">Profile</Typography>
            <Typography>
                Manage your personal information and account settings.
            </Typography>
            {user && (
                <Card className="mt-4 mb-2">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-base">
                                Signed in as
                            </CardTitle>
                            <Typography className="text-sm font-medium">
                                {user.name}
                            </Typography>
                        </div>
                        <Badge variant="outline">{user.email}</Badge>
                    </CardHeader>
                    <CardContent className="flex flex-row gap-4 text-sm text-muted-foreground">
                        <div>
                            <span className="font-medium">Initial balance:</span>{" "}
                            <span>${user.initialBalance.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            )}
            <Stack padding={0}>
                <ProfileForm />
            </Stack>
        </>
    );
}

