"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, Heart, Menu, X, LayoutDashboard, FlaskConical, ScanLine, Activity, User } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Simulation", href: "/simulation", icon: FlaskConical },
    { label: "Digital Twin", href: "/twin", icon: ScanLine },
    { label: "Monitoring", href: "/monitoring", icon: Activity },
    { label: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const isDashboard = pathname !== "/";

    // Get current page title
    const currentPage = navItems.find((n) => pathname.startsWith(n.href));

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border h-16">
                <div className="flex items-center h-full px-4 lg:px-6 gap-4">
                    {/* Mobile logo */}
                    <Link href="/" className="flex items-center gap-2 lg:hidden">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <Activity className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-sm text-dark">DigiTwin</span>
                    </Link>

                    {/* Page title on desktop */}
                    {isDashboard && (
                        <div className="hidden lg:block">
                            <h1 className="text-base font-semibold text-dark">
                                {currentPage?.label ?? "DigiTwin"}
                            </h1>
                        </div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Search (desktop) */}
                    <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-52">
                        <Search className="w-3.5 h-3.5 text-muted flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search metrics…"
                            className="bg-transparent text-sm text-dark placeholder:text-muted outline-none w-full"
                            aria-label="Search metrics"
                        />
                    </div>

                    {/* Notification */}
                    <button
                        className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-4 h-4 text-muted" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                    </button>

                    {/* Avatar */}
                    <Avatar name="Dr. Sarah Chen" size="sm" />

                    {/* Mobile menu toggle */}
                    <button
                        className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        onClick={() => setMobileOpen((o) => !o)}
                        aria-label="Toggle navigation"
                    >
                        {mobileOpen ? <X className="w-4 h-4 text-dark" /> : <Menu className="w-4 h-4 text-dark" />}
                    </button>
                </div>
            </header>

            {/* Mobile Nav Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-border shadow-card-md"
                    >
                        <nav className="p-4 space-y-1">
                            {navItems.map(({ label, href, icon: Icon }) => {
                                const active = pathname.startsWith(href);
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <div
                                            className={cn(
                                                "sidebar-link",
                                                active && "active"
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span>{label}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
