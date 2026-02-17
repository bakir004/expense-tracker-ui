import { LayoutDashboard, LogOut, User } from "lucide-react";
import { Group } from "../layout/group";
import { Stack } from "../layout/stack";
import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Typography } from "./typography";
import { useAuth } from "@/lib/auth-provider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const logout = () => {
        document.cookie = "jwt=; path=/; SameSite=Lax; max-age=0";
        setUser(null);
        navigate("/login");
    };

    const links = [
        {
            group: "Main",
            children: [
                {
                    label: "Dashboard",
                    icon: <LayoutDashboard />,
                    to: "/dashboard",
                },
                {
                    label: "Profile",
                    icon: <User />,
                    to: "/dashboard/profile",
                },
                {
                    label: "Logout",
                    icon: <LogOut />,
                    onClick: logout,
                },
            ],
        },
    ];

    return (
        <Stack className="w-64 bg-card justify-between">
            <Stack padding={0}>
                <Typography variant="h2">Expense Tracker</Typography>
                <Stack padding={0} gap={2}>
                    {links.map((linkGroup) => (
                        <SidebarLinkGroup
                            key={linkGroup.group}
                            linkGroup={linkGroup}
                        />
                    ))}
                </Stack>
            </Stack>
            <Group padding={0}>
                <SidebarUserSelect logout={logout} />
                <ThemeToggle />
            </Group>
        </Stack>
    );
}

function SidebarLinkGroup({
    linkGroup,
}: {
    linkGroup: {
        group: string;
        children: {
            label: string;
            icon: React.ReactNode;
            to?: string;
            onClick?: () => void;
        }[];
    };
}) {
    return (
        <Stack key={linkGroup.group} padding={0} gap={0}>
            <Typography className="text-muted-foreground uppercase scale-y-90 text-xs mb-1.5">
                {linkGroup.group}
            </Typography>
            {linkGroup.children.map((child) => (
                <SidebarLink key={child.label} child={child} />
            ))}
        </Stack>
    );
}

function SidebarLink({
    child,
}: {
    child: {
        label: string;
        icon: React.ReactNode;
        to?: string;
        onClick?: () => void;
    };
}) {
    return (
        <Button
            key={child.label}
            variant="ghost"
            className="justify-start"
            asChild
            onClick={child.onClick}
        >
            {child.to ? (
                <Link to={child.to} className="flex gap-2">
                    {child.icon}
                    {child.label}
                </Link>
            ) : (
                <div className="flex gap-2 cursor-pointer">
                    {child.icon}
                    {child.label}
                </div>
            )}
        </Button>
    );
}

function SidebarUserSelect({ logout }: { logout: () => void }) {
    const { user } = useAuth();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 grow">
                    <Avatar size="sm">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <Typography className="font-ntype text-lg mt-0.5">
                        {user?.name}
                    </Typography>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link
                        to="/dashboard/profile"
                        className="cursor-pointer flex items-center gap-2"
                    >
                        <User />
                        View Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
