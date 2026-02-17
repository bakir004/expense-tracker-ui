import { cn } from "@/lib/utils";

export type GroupProps = {
    children: React.ReactNode;
    gap?: number;
    padding?: number;
    className?: string;
    fullWidth?: boolean;
    fullHeight?: boolean;
};

export const Group = ({
    children,
    gap = 4,
    padding = 4,
    fullWidth = false,
    fullHeight = false,
    className,
}: GroupProps) => (
    <div
        className={cn(
            "flex flex-row",
            `gap-${gap}`,
            fullWidth ? "w-full" : "",
            fullHeight ? "h-full" : "",
            `p-${padding}`,
            className,
        )}
    >
        {children}
    </div>
);
