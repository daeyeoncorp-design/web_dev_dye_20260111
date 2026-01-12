"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    align?: "left" | "center" | "right";
    className?: string;
    id?: string;
}

export function Section({ children, align = "center", className = "", id }: SectionProps) {
    // We just provide layout structure. 
    // The visibility is driven by the parent's scroll or we use `whileInView` for simple triggers.
    // Prompt asks for "synchronized with the state", "text sections appear and disappear".

    return (
        <section id={id} className={`min-h-screen flex items-center px-6 md:px-20 ${className}`}>
            <div className={`w-full max-w-7xl mx-auto flex flex-col ${align === "left" ? "items-start text-left" :
                    align === "right" ? "items-end text-right" :
                        "items-center text-center"
                }`}>
                {children}
            </div>
        </section>
    );
}

export function TextReveal({ children, delay = 0 }: { children: ReactNode, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-20%" }} // Re-triggers when scrolling back? "Appear and disappear".
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}
