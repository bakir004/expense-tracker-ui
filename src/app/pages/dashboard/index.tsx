import Sidebar from "@/components/common/sidebar";
import { Group } from "@/components/layout/group";
import { Stack } from "@/components/layout/stack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
    return (
        <Group fullWidth gap={0} padding={0}>
            <Sidebar />
            <Stack className="max-h-screen h-screen" fullWidth>
                <ScrollArea>
                    <Outlet />
                </ScrollArea>
            </Stack>
        </Group>
    );
}
