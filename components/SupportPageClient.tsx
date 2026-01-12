"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Tables } from "@/types/supabase";

type Resource = Tables<"resources">;

export default function SupportPageClient({
    resources
}: {
    resources: Resource[]
}) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'resources' | 'contact' | 'location'>('resources');

    // Filter resources by type for better organization if needed, or just list all
    // For this design, let's group them or just list them. The design had separate icons.

    const getResourceIcon = (type: string) => {
        if (type === 'brochure') return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        );
        if (type === 'certification') return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
        );
        // Manual
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        );
    };

    const tabs = [
        {
            id: 'resources', label: t.support_page.tabs.resources, icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
            )
        },
        {
            id: 'contact', label: t.support_page.tabs.contact, icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            )
        },
        {
            id: 'location', label: t.support_page.tabs.location, icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            )
        }
    ] as const;

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505]">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                    >
                        {t.support_page.hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/60 max-w-2xl mx-auto"
                    >
                        {t.support_page.hero.subtitle}
                    </motion.p>
                </div>
            </section>

            {/* Tabs Navigation */}
            <div className="sticky top-16 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-center gap-2 md:gap-8 overflow-x-auto py-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <section className="max-w-7xl mx-auto px-6 py-20 min-h-[60vh]">
                <AnimatePresence mode="wait">
                    {activeTab === 'resources' && (
                        <motion.div
                            key="resources"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {resources.length === 0 ? (
                                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl">
                                    <p className="text-xl text-white/40">No resources available yet.</p>
                                </div>
                            ) : (
                                resources.map((res) => (
                                    <div key={res.id} className="bg-[#111] border border-white/5 p-8 rounded-2xl group hover:border-white/20 transition-colors">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${res.type === 'brochure' ? 'bg-purple-500/10 text-purple-400' :
                                            res.type === 'certification' ? 'bg-green-500/10 text-green-400' :
                                                'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {getResourceIcon(res.type)}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{res.title}</h3>
                                        <p className="text-white/40 text-sm mb-6 uppercase tracking-wider font-semibold">{res.type}</p>
                                        <a
                                            href={res.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 text-sm font-bold text-white/80 transition-colors ${res.type === 'brochure' ? 'group-hover:text-purple-400' :
                                                res.type === 'certification' ? 'group-hover:text-green-400' :
                                                    'group-hover:text-blue-400'
                                                }`}
                                        >
                                            {t.support_page.resources.download}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                                        </a>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'contact' && (
                        <motion.div
                            key="contact"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-6">{t.support_page.contact.title}</h3>
                                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-white/40 mb-2">{t.support_page.contact.name}</label>
                                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-white/40 mb-2">{t.support_page.contact.email}</label>
                                                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">{t.support_page.contact.subject}</label>
                                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">{t.support_page.contact.message}</label>
                                            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:border-white/30 transition-colors"></textarea>
                                        </div>
                                        <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 transition-colors">
                                            {t.support_page.contact.submit}
                                        </button>
                                    </form>
                                </div>
                                <div className="w-full md:w-1/3 space-y-8 pt-8 md:pt-0 md:border-l border-white/5 md:pl-12">
                                    <div>
                                        <h4 className="text-lg font-bold mb-4">{t.support_page.contact.info_title}</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs uppercase text-white/40 mb-1">{t.support_page.contact.email_label}</p>
                                                <a href="mailto:support@daeyeon.com" className="text-blue-400 hover:text-blue-300">support@daeyeon.com</a>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase text-white/40 mb-1">{t.support_page.contact.phone_label}</p>
                                                <p className="text-white">+82 00-000-0000</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase text-white/40 mb-1">Fax</p>
                                                <p className="text-white">+82 00-000-0000</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'location' && (
                        <motion.div
                            key="location"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden">
                                <div className="h-[400px] bg-[#222] relative flex items-center justify-center">
                                    {/* Placeholder for Google Map Embed */}
                                    <div className="text-white/20 font-bold text-lg">Google Map Embed Area</div>
                                </div>
                                <div className="p-8 md:p-12 flex items-start justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{t.support_page.location.title}</h3>
                                        <p className="text-white/60 text-lg max-w-xl">{t.support_page.location.address}</p>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("DAEYEON ENG " + t.support_page.location.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                                    >
                                        Open in Maps
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <Footer />
        </main>
    );
}
