import { ThemeToggle } from "@/components/common/theme-toggle";
import { Typography } from "@/components/common/typography";
import { Group } from "@/components/layout/group";
import { Screen } from "@/components/layout/screen";
import { Stack } from "@/components/layout/stack";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <Screen>
            <Stack className="items-center">
                <Typography variant="h1">
                    Welcome to Expense Tracker!
                </Typography>
                <Typography variant="h3">
                    Please register or log in to start
                </Typography>
                <Group>
                    <Button asChild>
                        <Link to="/register">Register</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link to="/login">Login</Link>
                    </Button>
                    <ThemeToggle />
                </Group>
            </Stack>
        </Screen>
    );
}
