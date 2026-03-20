"use client";
import { Heart, Activity } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-border bg-white mt-auto py-4 px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Activity className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-dark">DigiTwin</span>
                    <span className="text-xs text-muted">Healthcare AI Platform</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted">© 2026 DigiTwin Inc.</span>
                    <Link href="#" className="text-xs text-muted hover:text-dark transition-colors">Privacy</Link>
                    <Link href="#" className="text-xs text-muted hover:text-dark transition-colors">Terms</Link>
                    <span className="flex items-center gap-1 text-xs text-health-green font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        All Systems Operational
                    </span>
                </div>
            </div>
        </footer>
    );
}
