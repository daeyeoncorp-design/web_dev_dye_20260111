"use client";

import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeHover, setActiveHover] = useState<string | null>(null);
    const { t, language, toggleLanguage } = useLanguage();

    // Construct NAV_ITEMS dynamically based on current language
    const NAV_ITEMS = [
        {
            id: "about",
            label: t.nav.about,
            href: "/about",
            subItems: t.nav.sub_about.map((label, idx) => {
                const anchors = ["/about#overview", "/about#history", "/about#vision"];
                return { label, href: anchors[idx] || "/about" };
            })
        },
        {
            id: "business",
            label: t.nav.business,
            href: "/business",
            subItems: t.nav.sub_business.map((label, idx) => {
                const anchors = ["/business#bgms", "/business#ivd", "/business#tooling"];
                return { label, href: anchors[idx] || "/business" };
            })
        },
        {
            id: "products",
            label: t.nav.products,
            href: "/#products",
            subItems: t.nav.sub_products.map(label => ({ label, href: "/#products" }))
        },
        {
            id: "support",
            label: t.nav.support,
            href: "/#support",
            subItems: t.nav.sub_support.map(label => ({ label, href: "/#support" }))
        }
    ];

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);



    return (
        <>
            {/* Background Dimming Overlay */}
            <AnimatePresence>
                {activeHover && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
                        onMouseEnter={() => setActiveHover(null)}
                    />
                )}
            </AnimatePresence>

            {/* Submenu Background Strip */}
            <AnimatePresence>
                {activeHover && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "350px" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed top-0 left-0 right-0 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 z-40 shadow-2xl origin-top"
                        style={{ paddingTop: "80px" }}
                    />
                )}
            </AnimatePresence>

            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || activeHover ? "bg-transparent" : "bg-transparent"}`}
            >
                {/* Navbar Background for Scrolled State */}
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${isScrolled && !activeHover ? "opacity-100 glass border-b border-white/5" : "opacity-0"}`}
                />

                <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 z-50">
                    <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}>
                        {/* Left: Logo */}
                        <div className="flex items-center z-50">
                            <Link href="/" className="relative h-6 overflow-hidden w-[140px]" onMouseEnter={() => setActiveHover(null)}>
                                <motion.span
                                    className="absolute left-0 top-0 whitespace-nowrap text-lg font-medium tracking-tight text-white/90"
                                    animate={{
                                        opacity: isScrolled ? 0 : 1,
                                        y: isScrolled ? -20 : 0
                                    }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {t.common.company_name}
                                </motion.span>
                                <motion.span
                                    className="absolute left-0 top-0 whitespace-nowrap text-lg font-bold tracking-tight text-red-500"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: isScrolled ? 1 : 0,
                                        y: isScrolled ? 0 : 20
                                    }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {t.common.ticker}
                                </motion.span>
                            </Link>
                        </div>

                        {/* Center: Navigation */}
                        <div className="hidden md:flex items-center space-x-12 h-full z-50">
                            {NAV_ITEMS.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative h-full flex items-center justify-center group"
                                    onMouseEnter={() => setActiveHover(item.id)}
                                >
                                    {/* Trigger */}
                                    <Link
                                        href={item.href}
                                        className={`text-sm font-medium transition-colors duration-300 relative z-50 ${activeHover ? (activeHover === item.id ? "text-white" : "text-white/40") : "text-white/70 hover:text-white"}`}
                                    >
                                        {item.label}
                                    </Link>

                                    {/* Submenu Dropdown */}
                                    <AnimatePresence>
                                        {activeHover === item.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-0 mt-2 w-max min-w-[150px] flex flex-col gap-3 py-4"
                                            >
                                                {item.subItems.map((sub, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={sub.href}
                                                        className="text-white/70 hover:text-white text-base font-medium transition-colors text-left"
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* Right: CTA & Language */}
                        <div className="z-50 flex items-center gap-4">
                            <button
                                onMouseEnter={() => setActiveHover(null)}
                                className="px-5 py-2 text-sm font-semibold text-white bg-white/10 rounded-full border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,80,255,0.1)] hover:shadow-[0_0_20px_rgba(0,214,255,0.3)]"
                            >
                                {t.nav.login}
                            </button>
                            <button
                                onClick={toggleLanguage}
                                className="text-2xl hover:scale-110 transition-transform"
                                title="Switch Language"
                            >
                                {language === "en" ? "🇬🇧" : "🇰🇷"}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>
        </>
    );
}
