import Sidebar from "@/components/common/sidebar";
import { Group } from "@/components/layout/group";
import { Stack } from "@/components/layout/stack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
    return (
        <Group fullWidth gap={0} padding={0}>
            <Sidebar />
            <ScrollArea className="max-h-screen h-screen w-full">
                <Stack className="h-full w-full max-w-240 mx-auto" fullWidth>
                    <Outlet />
                </Stack>
            </ScrollArea>
        </Group>
    );
}
