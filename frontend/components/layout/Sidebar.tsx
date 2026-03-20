"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, FlaskConical, ScanLine, Activity, User,
    Heart, Bell, Settings, ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Simulation", href: "/simulation", icon: FlaskConical },
    { label: "Digital Twin", href: "/twin", icon: ScanLine },
    { label: "Monitoring", href: "/monitoring", icon: Activity },
    { label: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            className="hidden lg:flex flex-col h-screen sticky top-0 bg-white border-r border-border z-30"
            animate={{ width: collapsed ? 72 : 240 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {/* Brand */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-border overflow-hidden">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <p className="font-bold text-dark text-sm leading-none">DigiTwin</p>
                            <p className="text-[10px] text-muted mt-0.5">Healthcare AI</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setCollapsed((c) => !c)}
                    className="ml-auto flex-shrink-0 w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    aria-label="Toggle sidebar"
                >
                    {collapsed ? (
                        <ChevronRight className="w-3.5 h-3.5 text-muted" />
                    ) : (
                        <ChevronLeft className="w-3.5 h-3.5 text-muted" />
                    )}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-hidden">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                        <Link key={href} href={href} aria-label={label}>
                            <motion.div
                                className={cn(
                                    "sidebar-link",
                                    active && "active",
                                    collapsed && "justify-center"
                                )}
                                whileHover={{ x: collapsed ? 0 : 2 }}
                                title={collapsed ? label : undefined}
                            >
                                <Icon className="w-4.5 h-4.5 flex-shrink-0 w-5 h-5" />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-sm"
                                        >
                                            {label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* User footer */}
            <div className={cn("border-t border-border p-3", collapsed && "px-2")}>
                <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                    <Avatar name="Dr. Sarah Chen" size="sm" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-xs font-semibold text-dark truncate">Dr. Sarah Chen</p>
                                <p className="text-[10px] text-muted truncate">Cardiologist</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    );
}
