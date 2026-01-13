"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { BUSINESS_IMAGES } from "@/constants/images";

export default function EquipmentCards() {
    const { t } = useLanguage();

    const cards = [
        { id: 1, title: t.cards.title1, subtitle: t.cards.desc1, image: BUSINESS_IMAGES.bgms },
        { id: 2, title: t.cards.title2, subtitle: t.cards.desc2, image: BUSINESS_IMAGES.ivd },
        { id: 3, title: t.cards.title3, subtitle: t.cards.desc3, image: BUSINESS_IMAGES.tooling },
    ];

    return (
        <section className="relative z-10 w-full bg-[#050505] py-24 px-6 md:px-12">
            <motion.div
                className="max-w-7xl mx-auto mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    {t.cards.intro_head}<span className="text-blue-500">{t.common.company_short}</span>{t.cards.intro_tail}
                </h2>
                <p className="text-xl text-white/60">
                    {t.cards.header_desc}
                </p>
            </motion.div>

            <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6">
                {cards.map((card) => (
                    <motion.div
                        key={card.id}
                        className="relative group overflow-hidden rounded-3xl bg-[#0A0A0C] border border-white/5 h-[400px] w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.6, delay: card.id * 0.1 }}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={card.image}
                                alt={card.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>

                        {/* Text Content */}
                        <div className="absolute bottom-0 left-0 p-8 z-10">
                            <p className="text-blue-400 font-medium text-sm mb-2 uppercase tracking-wider">
                                {card.subtitle}
                            </p>
                            <h3 className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors">
                                {card.title}
                            </h3>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
