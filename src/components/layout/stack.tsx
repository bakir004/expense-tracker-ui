import { cn } from "@/lib/utils";

export type StackProps = {
    children: React.ReactNode;
    gap?: number;
    padding?: number;
    className?: string;
    fullWidth?: boolean;
    fullHeight?: boolean;
};

export const Stack = ({
    children,
    gap = 4,
    padding = 4,
    fullWidth = false,
    fullHeight = false,
    className,
}: StackProps) => (
    <div
        className={cn(
            "flex flex-col",
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
