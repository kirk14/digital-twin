"use client";
import { cn } from "@/lib/utils";

interface AvatarProps {
    name: string;
    src?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeMap = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
};

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={cn("rounded-full object-cover ring-2 ring-white", sizeMap[size], className)}
            />
        );
    }
    return (
        <div
            className={cn(
                "rounded-full bg-primary flex items-center justify-center font-semibold text-white ring-2 ring-white",
                sizeMap[size],
                className
            )}
        >
            {getInitials(name)}
        </div>
    );
}
