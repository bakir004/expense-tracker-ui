import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
    variant?: "h1" | "h2" | "h3" | "p" | "blockquote" | "code";
    children: ReactNode;
    className?: string;
    as?: ElementType;
}

const variants = {
    h1: "scroll-m-20 text-3xl font-bold lg:text-4xl",
    h2: "scroll-m-20 text-2xl font-semibold tracking-wider",
    h3: "scroll-m-20 text-2xl",
    p: "text-sm",
    blockquote: "mt-6 border-l-2 pl-6 italic",
    code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
};

export function Typography({
    variant = "p",
    children,
    className,
    as,
}: TypographyProps) {
    const Component = as || variant;

    return (
        <Component className={cn(variants[variant], className)}>
            {children}
        </Component>
    );
}
