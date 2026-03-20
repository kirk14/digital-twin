"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

const variantMap = {
    primary: "bg-primary text-white hover:bg-primary-700 shadow-sm hover:shadow-md",
    secondary: "bg-slate-100 text-dark hover:bg-slate-200",
    ghost: "text-muted hover:text-dark hover:bg-slate-100",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-border text-dark hover:bg-slate-50",
};

const sizeMap = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2 text-sm rounded-xl gap-2",
    lg: "px-6 py-2.5 text-sm rounded-xl gap-2",
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    className,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "inline-flex items-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                variantMap[variant],
                sizeMap[size],
                className
            )}
            disabled={disabled || loading}
            onClick={props.onClick}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : icon ? (
                <span className="flex-shrink-0">{icon}</span>
            ) : null}
            {children}
        </motion.button>
    );
}
