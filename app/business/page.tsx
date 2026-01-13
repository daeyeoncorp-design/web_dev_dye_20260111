"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import ImageSequence from "@/components/ImageSequence";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { BUSINESS_IMAGES } from "@/constants/images";

export default function BusinessPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-blue-500/30">
            <Navbar />

            {/* Background Animation */}
            {/* Using a longer scrollEnd to allow for more content scrolling while animation plays */}
            <ImageSequence scrollEnd={0.5} />

            {/* HERO SECTION */}
            <section className="relative h-screen flex items-center justify-center text-center px-6">
                <div className="max-w-5xl mx-auto z-10 flex flex-col items-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                    >
                        {t.business_page.hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-white/80 font-medium leading-relaxed max-w-4xl"
                    >
                        {t.business_page.hero.subtitle}
                    </motion.p>
                </div>
                {/* Overlay gradient - Darker on mobile for better text visibility against video/images */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#050505]/60 to-[#050505] md:from-transparent md:via-[#050505]/50" />
            </section>

            {/* PROCESS SECTION MOVED FROM ABOUT PAGE */}
            <section id="process" className="py-24 bg-[#0A0A0C] border-t border-white/10">
                <motion.div
                    className="max-w-7xl mx-auto px-6 md:px-12"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.business_page.process.title}</h2>
                        <p className="text-white/80 md:text-white/60 text-lg">{t.business_page.process.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {t.business_page.process.steps.map((step, idx) => (
                            <div key={idx} className="relative group">
                                <div className="absolute inset-0 bg-blue-500/5 rounded-xl group-hover:bg-blue-500/10 transition-colors" />
                                <div className="relative p-6 h-full border border-white/5 rounded-xl hover:border-blue-500/30 transition-colors flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                                        {idx + 1}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                    <p className="text-sm text-white/70 md:text-white/50">{step.desc}</p>
                                </div>
                                {/* Connector Line (Desktop) */}
                                {idx < 4 && (
                                    <div className="hidden md:block absolute top-[2.5rem] -right-[1rem] w-8 h-[2px] bg-white/10 z-20" />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* AREAS SECTION */}
            <section className="py-24 px-6 md:px-12 bg-[#0A0A0C] border-t border-white/10">
                <div className="max-w-7xl mx-auto space-y-32">
                    {t.business_page.areas.map((area, idx) => (
                        <motion.div
                            key={area.id}
                            id={area.id} // Added ID for navigation
                            className={`flex flex-col md:flex-row gap-16 items-center scroll-mt-32 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Text Content */}
                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">
                                    <span className="text-blue-500 font-mono text-sm tracking-wider uppercase">
                                        0{idx + 1}
                                    </span>
                                    <h3 className="text-3xl md:text-4xl font-bold">{area.title}</h3>
                                    <p className="text-xl text-white/70 md:text-white/50">{area.subtitle}</p>
                                </div>
                                <p className="text-lg text-white/90 md:text-white/80 leading-relaxed break-keep">
                                    {area.desc}
                                </p>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                                    {area.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-3 text-white/80 md:text-white/70">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Visual Placeholder / Image */}
                            <div className="flex-1 w-full aspect-video rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                                {/* Fallback Gradient (visible if image fails or while loading) */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 z-0" />

                                {/* Image */}
                                <img
                                    src={BUSINESS_IMAGES[area.id as keyof typeof BUSINESS_IMAGES] || `/images/business/${area.id}.png`}
                                    alt={area.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-10"
                                    onError={(e) => {
                                        // Hide broken image icon if file doesn't exist yet
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
