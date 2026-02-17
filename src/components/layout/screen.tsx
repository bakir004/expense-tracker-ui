import { cn } from "@/lib/utils";

export type ScreenProps = {
    children: React.ReactNode;
    className?: string;
};

export const Screen = ({ children, className }: ScreenProps) => (
    <div
        className={cn(
            "flex w-full h-screen items-center justify-center p-4",
            className,
        )}
    >
        {children}
    </div>
);
