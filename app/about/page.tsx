"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import ImageSequence from "@/components/ImageSequence";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-blue-500/30">
            <Navbar />

            {/* HERO SECTION - Reusing ImageSequence for consistency */}
            {/* Using default 'ex' sequence but we can generate 'about_ex' later */}
            <ImageSequence scrollEnd={0.3} />

            <section className="relative h-screen flex items-center justify-center text-center px-6">
                <div className="max-w-4xl mx-auto z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                    >
                        {t.about_page.hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-blue-400 font-medium"
                    >
                        {t.about_page.hero.subtitle}
                    </motion.p>
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
            </section>

            {/* OVERVIEW SECTION */}
            <section id="overview" className="py-24 px-6 md:px-12 relative z-10 border-t border-white/10 bg-[#050505]">
                <motion.div
                    className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8 }}
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-8 h-1 bg-blue-500 rounded-full" />
                            {t.about_page.overview.title}
                        </h2>
                        <div className="space-y-6 text-lg text-white/80 leading-relaxed">
                            <p className="break-keep">{t.about_page.overview.desc}</p>

                            <div className="grid grid-cols-[1fr_3fr] gap-6 pt-6 border-t border-white/10">
                                <div>
                                    <h3 className="text-sm text-white/40 uppercase tracking-widest mb-1">{t.about_page.overview.ceo_label}</h3>
                                    <p className="text-xl font-semibold">{t.about_page.overview.ceo_name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm text-white/40 uppercase tracking-widest mb-1">{t.about_page.org.title}</h3>
                                    <p className="text-base text-white/70">{t.about_page.org.depts.join(", ")}</p>
                                </div>
                            </div>

                            <div className="pt-6">
                                <h3 className="text-sm text-white/40 uppercase tracking-widest mb-1">{t.about_page.overview.address_label}</h3>
                                <p className="text-lg">{t.about_page.overview.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Facility Info Card */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold mb-6">{t.about_page.facility.title}</h3>
                        <div className="space-y-4">
                            {[
                                { label: t.about_page.facility.type_label, value: t.about_page.facility.type_value },
                                { label: t.about_page.facility.land_label, value: t.about_page.facility.land_value },
                                { label: t.about_page.facility.floor_label, value: t.about_page.facility.floor_value },
                                { label: t.about_page.facility.power_label, value: t.about_page.facility.power_value },
                                { label: t.about_page.facility.clean_label, value: t.about_page.facility.clean_value },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                    <span className="text-white/50">{item.label}</span>
                                    <span className="font-semibold text-blue-400">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* VISION SECTION */}
            <section id="vision" className="py-24 bg-[#0A0A0C] border-t border-white/10">
                <motion.div
                    className="max-w-7xl mx-auto px-6 md:px-12"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.about_page.vision.title}</h2>
                        <p className="text-white/60 text-lg">{t.about_page.vision.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {t.about_page.vision.items.map((item, idx) => (
                            <div key={idx} className="relative group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center">
                                <div className="text-blue-500 text-6xl font-black mb-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                    0{idx + 1}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-lg text-white/60">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* HISTORY SECTION */}
            <section id="history" className="py-32 px-6 md:px-12 bg-[#050505] border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-5xl font-bold mb-16 border-b border-white/10 pb-6"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {t.about_page.history.title}
                    </motion.h2>

                    <div className="relative ml-3 md:ml-0 space-y-12">
                        {t.about_page.history.items.map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="relative pl-8 md:pl-12"
                                initial={{ opacity: 0, x: -20, y: 20 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                {/* Dot */}
                                <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-blue-500 box-content border-4 border-[#050505]" />

                                <div className="flex flex-col md:flex-row gap-2 md:gap-12">
                                    <span className="text-2xl md:text-3xl font-bold text-white/30 self-start shrink-0 w-24">
                                        {item.year}
                                    </span>
                                    <div className="space-y-2 pt-1">
                                        {item.events.map((event, eIdx) => (
                                            <p key={eIdx} className="text-lg md:text-xl text-white/90">
                                                {event}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
