"use client";
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";

interface PageWrapperProps {
    children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-bg">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar />
                <motion.main
                    className="flex-1 overflow-y-auto"
                    initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="p-4 lg:p-6 min-h-full flex flex-col">
                        {children}
                        <div className="mt-auto pt-6">
                            <Footer />
                        </div>
                    </div>
                </motion.main>
            </div>
        </div>
    );
}
