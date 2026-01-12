"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    // -- State --
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeHover, setActiveHover] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ name: string, slug: string }[]>([]);

    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // Hooks
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const { t, language, toggleLanguage } = useLanguage();
    const supabase = createClient();

    // -- Effects --

    // 1. Scroll Handler
    useMotionValueEvent(scrollY, "change", (latest) => {
        const scrolled = latest > 50;
        if (scrolled !== isScrolled) setIsScrolled(scrolled);
    });

    // 2. Fetch Categories (Dynamic Products)
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('name, slug').order('order', { ascending: true });
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    // 3. Auth Listener
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                if (data) setUserRole(data.role);
            }
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                supabase.from('profiles').select('role').eq('id', session.user.id).single().then(({ data }) => {
                    if (data) setUserRole(data.role);
                });
            } else {
                setUserRole(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // 4. Close Mobile Menu on Resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 5. Body Scroll Lock
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);


    // -- Handlers --
    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    // -- Navigation Structure --
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

    // -- Styles --
    // STRICT NO-TRANSFORM CLASSES
    const linkBaseClass = "relative h-full flex items-center px-1 text-sm font-medium transition-colors duration-200 select-none !transform-none outline-none focus:outline-none draggable-none";
    const subLinkClass = "block py-2 text-base text-white/70 hover:text-white transition-colors duration-200 select-none !transform-none outline-none focus:outline-none draggable-none";

    return (
        <>
            {/* Desktop Backdrop (Hover) */}
            <AnimatePresence>
                {activeHover && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                        onMouseEnter={() => setActiveHover(null)}
                    />
                )}
            </AnimatePresence>

            {/* Desktop Submenu Strip */}
            <AnimatePresence>
                {activeHover && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 320, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="fixed top-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 z-40 shadow-2xl overflow-hidden"
                        style={{ paddingTop: isScrolled ? 64 : 80 }}
                    />
                )}
            </AnimatePresence>

            {/* Main Navbar */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || activeHover ? "bg-[#050505]/80 backdrop-blur-md border-b border-white/5 h-16" : "bg-transparent h-20"}`}
            >
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                    {/* Brand */}
                    <div className="flex items-center z-50">
                        <Link
                            href="/"
                            className="flex items-center gap-2 group select-none !transform-none"
                            onMouseEnter={() => setActiveHover(null)}
                        >
                            <span className="text-xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
                                {t.common.company_name}
                            </span>
                            <span className="text-red-500 font-bold text-xl hidden md:block">.</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-10 h-full z-50">
                        {NAV_ITEMS.map((item) => (
                            <div
                                key={item.id}
                                className="h-full flex items-center relative group"
                                onMouseEnter={() => setActiveHover(item.id)}
                            >
                                <Link
                                    href={item.href}
                                    className={`${linkBaseClass} ${activeHover ? (activeHover === item.id ? "text-white" : "text-white/40") : "text-white/80 hover:text-white"}`}
                                    draggable={false}
                                >
                                    {item.label}
                                </Link>

                                {/* Dropdown Content */}
                                <AnimatePresence>
                                    {activeHover === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="fixed top-[64px] (isScrolled ? 'top-16' : 'top-20') left-0 w-full pointer-events-none"
                                        >
                                            {/* We position relative to the container inside the strip actually, 
                                                but for simplicity in this structure, we just render content relative to the parent div 
                                                OR we can use the Strip we created above.
                                                
                                                Actually, the 'Strip' above is just background. We need the content here.
                                                To align with the link, we can just put absolute positioning here.
                                            */}
                                            <div className="absolute top-[100%] left-0 pt-8 w-[200px] pointer-events-auto">
                                                <div className="flex flex-col gap-3">
                                                    {item.subItems.map((sub, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={sub.href}
                                                            className={subLinkClass}
                                                            draggable={false}
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    {/* Right Side: Auth & Lang */}
                    <div className="hidden md:flex items-center gap-6 z-50">
                        {/* Language */}
                        <button
                            onClick={toggleLanguage}
                            className="text-lg hover:text-white text-white/70 transition-colors !transform-none select-none"
                        >
                            {language === 'en' ? 'KO' : 'EN'}
                        </button>

                        {/* Login/Profile */}
                        {!user ? (
                            <Link
                                href="/login"
                                className="px-5 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all !transform-none select-none"
                                onMouseEnter={() => setActiveHover(null)}
                            >
                                {t.nav.login}
                            </Link>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
                                >
                                    <span className="sr-only">Profile</span>
                                    <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>

                                <AnimatePresence>
                                    {profileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute right-0 top-full mt-2 w-56 bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden py-1"
                                        >
                                            <div className="px-4 py-3 border-b border-white/5">
                                                <p className="text-xs text-white/50">Signed in as</p>
                                                <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                            </div>
                                            {(userRole === 'admin' || userRole === 'super_admin') && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setProfileMenuOpen(false)}
                                                    className="flex items-center px-4 py-2.5 text-sm text-blue-400 hover:bg-white/5 border-b border-white/5"
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5"
                                            >
                                                {t.nav.logout}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden z-50 p-2 text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="fixed inset-0 z-40 bg-[#050505] pt-24 px-6 flex flex-col overflow-y-auto"
                    >
                        <div className="flex flex-col gap-6">
                            {NAV_ITEMS.map((item) => (
                                <div key={item.id} className="border-b border-white/10 pb-4">
                                    <button
                                        onClick={() => setMobileExpanded(mobileExpanded === item.id ? null : item.id)}
                                        className="w-full flex items-center justify-between text-xl font-bold text-white mb-2"
                                    >
                                        {item.label}
                                        <svg
                                            className={`w-5 h-5 transition-transform ${mobileExpanded === item.id ? 'rotate-180' : ''}`}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <AnimatePresence>
                                        {mobileExpanded === item.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden pl-4 flex flex-col gap-3"
                                            >
                                                {item.subItems.map((sub, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={sub.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="text-white/60 hover:text-white py-1 block"
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

                        <div className="mt-auto pb-10 flex items-center justify-between pt-8 border-t border-white/10">
                            {!user ? (
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-xl font-bold text-white"
                                >
                                    {t.nav.login}
                                </Link>
                            ) : (
                                <button onClick={handleLogout} className="text-xl font-bold text-red-500">
                                    {t.nav.logout}
                                </button>
                            )}
                            <button onClick={toggleLanguage} className="text-xl font-bold text-white">
                                {language === 'en' ? 'KO' : 'EN'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
