"use client";

import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeHover, setActiveHover] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const { t, language, toggleLanguage } = useLanguage();
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const supabase = createClient();

    const [categories, setCategories] = useState<{ name: string, slug: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('name, slug').order('order', { ascending: true });
            if (data) setCategories(data);
        }
        fetchCategories();
    }, []);

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
            href: "/products",
            subItems: categories.length > 0
                ? categories.map(c => ({ label: c.name, href: `/products?category=${c.slug}` }))
                : t.nav.sub_products.map(label => ({ label, href: "/products" }))
        },
        {
            id: "support",
            label: t.nav.support,
            href: "/support",
            subItems: t.nav.sub_support.map((label, idx) => {
                const query = ["?tab=resources", "?tab=contact", "?tab=location"];
                return { label, href: `/support${query[idx] || ""}` };
            })
        }
    ];

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auth State Listener
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                if (profile) setUserRole(profile.role);
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                // simple refetch to be safe
                supabase.from('profiles').select('role').eq('id', session.user.id).single().then(({ data }) => {
                    if (data) setUserRole(data.role);
                });
            } else {
                setUserRole(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload(); // Refresh to ensure clean state
    };

    const toggleMobileSubmenu = (id: string) => {
        setMobileExpanded(mobileExpanded === id ? null : id);
    };



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
                        style={{ paddingTop: isScrolled ? "64px" : "80px" }}
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
                                    <span className="hidden md:inline">{t.common.company_name}</span>
                                    <span className="md:hidden">{t.common.ticker}</span>
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
                                        draggable={false}
                                        className={`text-sm font-medium transition-colors duration-300 relative z-50 select-none !transform-none focus:outline-none inline-flex items-center h-full ${activeHover ? (activeHover === item.id ? "text-white" : "text-white/40") : "text-white/70 hover:text-white active:text-white"}`}
                                    >
                                        {item.label}
                                    </Link>

                                    {/* Submenu Dropdown */}
                                    <AnimatePresence>
                                        {activeHover === item.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-0 w-max min-w-[150px] flex flex-col gap-3 py-6"
                                            >
                                                {item.subItems.map((sub, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={sub.href}
                                                        draggable={false}
                                                        className="block text-white/70 hover:text-white text-base font-medium transition-colors text-left select-none !transform-none focus:outline-none"
                                                    >
                                                        {sub.label.trim()}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* Right: CTA & Language (Desktop Only) */}
                        <div className="hidden md:flex z-50 items-center gap-4">
                            {!user ? (
                                <Link
                                    href="/login"
                                    onMouseEnter={() => setActiveHover(null)}
                                    className="px-5 py-2 text-sm font-semibold text-white bg-white/10 rounded-full border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,80,255,0.1)] hover:shadow-[0_0_20px_rgba(0,214,255,0.3)]"
                                >
                                    {t.nav.login}
                                </Link>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all text-white/90"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
                                            >
                                                <div className="px-4 py-3 border-b border-white/5">
                                                    <p className="text-xs text-white/50">{t.common.company_name} Account</p>
                                                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                                </div>
                                                {(userRole === 'admin' || userRole === 'super_admin') && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-blue-400 hover:bg-white/5 transition-colors flex items-center gap-2 border-b border-white/5"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
                                                        Dashboard
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                                    Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                            <button
                                onClick={toggleLanguage}
                                className="text-2xl hover:scale-110 transition-transform"
                                title="Switch Language"
                            >
                                {language === "en" ? "🇬🇧" : "🇰🇷"}
                            </button>
                        </div>

                        {/* Mobile Burger Menu Button */}
                        <div className="md:hidden z-50 flex items-center gap-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50 group"
                            >
                                <motion.span
                                    animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                    className="w-full h-[2px] bg-white rounded-full origin-center transition-all bg-white/80 group-hover:bg-white"
                                />
                                <motion.span
                                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                    className="w-full h-[2px] bg-white rounded-full transition-all bg-white/80 group-hover:bg-white"
                                />
                                <motion.span
                                    animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                    className="w-full h-[2px] bg-white rounded-full origin-center transition-all bg-white/80 group-hover:bg-white"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-40 bg-black/95 flex flex-col pt-24 px-6 pb-8 overflow-y-auto"
                    >
                        <div className="flex flex-col gap-6 flex-1 w-full max-w-lg mx-auto">
                            {NAV_ITEMS.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.1 }}
                                    className="border-b border-white/10 pb-4"
                                >
                                    <div
                                        onClick={() => toggleMobileSubmenu(item.id)}
                                        className="flex items-center justify-between cursor-pointer group"
                                    >
                                        <span className={`text-2xl font-bold transition-colors ${mobileExpanded === item.id ? "text-blue-400" : "text-white group-hover:text-blue-300"}`}>
                                            {item.label}
                                        </span>
                                        {/* Chevron Icon */}
                                        <motion.svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            animate={{ rotate: mobileExpanded === item.id ? 180 : 0 }}
                                            className="text-white/50"
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </motion.svg>
                                    </div>

                                    {/* Mobile Accordion Submenu */}
                                    <AnimatePresence>
                                        {mobileExpanded === item.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex flex-col gap-4 mt-4 pl-4 border-l-2 border-white/10">
                                                    {item.subItems.map((sub, subIdx) => (
                                                        <Link
                                                            key={subIdx}
                                                            href={sub.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="text-lg text-white/60 hover:text-white transition-colors block py-1"
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile Login Button (Text Style) & Language */}
                        <div className="mt-8 w-full max-w-lg mx-auto pb-8 flex items-center justify-between">
                            {!user ? (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-white/70 hover:text-white transition-colors text-left"
                                >
                                    {t.nav.login}
                                </Link>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="text-2xl font-bold text-red-500/80 hover:text-red-500 transition-colors text-left flex items-center gap-2"
                                >
                                    {t.nav.logout || "Log out"}
                                </button>
                            )}
                            <button
                                onClick={toggleLanguage}
                                className="text-2xl hover:scale-110 transition-transform"
                                title="Switch Language"
                            >
                                {language === "en" ? "🇬🇧" : "🇰🇷"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
