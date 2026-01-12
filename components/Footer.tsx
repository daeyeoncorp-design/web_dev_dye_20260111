"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
    const { t } = useLanguage();
    const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'careers' | null>(null);

    const Modal = ({ title, content, onClose }: { title: string, content: React.ReactNode, onClose: () => void }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white p-2">✕</button>
                </div>
                <div className="p-6 overflow-y-auto text-white/70 leading-relaxed space-y-4">
                    {content}
                </div>
                <div className="p-6 border-t border-white/10 bg-[#111]">
                    <button onClick={onClose} className="w-full pym-3 bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 transition-colors">
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <>
            <footer className="relative z-10 w-full bg-[#050505] border-t border-white/5 py-16 px-6 md:px-12 text-sm text-white/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">DAEYEON ENG</h3>
                        <p>{t.footer.company_desc}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-10 md:gap-20">
                        <div>
                            <h4 className="text-white font-semibold mb-4">{t.footer.company_title}</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="hover:text-blue-400 transition-colors">{t.footer.links.about}</Link></li>
                                <li>
                                    <button onClick={() => setActiveModal('careers')} className="hover:text-blue-400 transition-colors text-left">
                                        {t.footer.links.careers}
                                    </button>
                                </li>
                                <li><Link href="/support?tab=contact" className="hover:text-blue-400 transition-colors">{t.footer.links.contact}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">{t.footer.legal_title}</h4>
                            <ul className="space-y-2">
                                <li>
                                    <button onClick={() => setActiveModal('privacy')} className="hover:text-blue-400 transition-colors text-left">
                                        {t.footer.links.privacy}
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveModal('terms')} className="hover:text-blue-400 transition-colors text-left">
                                        {t.footer.links.terms}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© {new Date().getFullYear()} DAEYEON ENG. {t.footer.rights}</p>
                    <p>{t.footer.designed_by}</p>
                </div>
            </footer>

            <AnimatePresence>
                {activeModal === 'careers' && (
                    <Modal
                        title="Careers at DAEYEON"
                        onClose={() => setActiveModal(null)}
                        content={
                            <div className="space-y-4">
                                <p>We are always looking for talented individuals to join our team.</p>
                                <p>Currently, there are no specific open positions listed online, but we welcome spontaneous applications.</p>
                                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                    <p className="font-semibold text-white mb-2">Contact HR</p>
                                    <p>Please send your resume and cover letter to:</p>
                                    <a href="mailto:careers@daeyeon.com" className="text-blue-400 hover:text-blue-300 block mt-1">careers@daeyeon.com</a>
                                </div>
                            </div>
                        }
                    />
                )}
                {activeModal === 'privacy' && (
                    <Modal
                        title="Privacy Policy"
                        onClose={() => setActiveModal(null)}
                        content={
                            <div>
                                <p className="mb-4">Last Updated: {new Date().getFullYear()}</p>
                                <h4 className="text-white font-bold mb-2">1. Introduction</h4>
                                <p className="mb-4">DAEYEON ENG respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
                                <h4 className="text-white font-bold mb-2">2. Data We Collect</h4>
                                <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you such as Identity Data (name) and Contact Data (email, phone number) when you fill out our contact forms.</p>
                                <h4 className="text-white font-bold mb-2">3. How We Use Your Data</h4>
                                <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to respond to your inquiries and manage our relationship with you.</p>
                            </div>
                        }
                    />
                )}
                {activeModal === 'terms' && (
                    <Modal
                        title="Terms of Service"
                        onClose={() => setActiveModal(null)}
                        content={
                            <div>
                                <p className="mb-4">Last Updated: {new Date().getFullYear()}</p>
                                <h4 className="text-white font-bold mb-2">1. Agreement to Terms</h4>
                                <p className="mb-4">By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.</p>
                                <h4 className="text-white font-bold mb-2">2. Intellectual Property</h4>
                                <p className="mb-4">The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary rights.</p>
                                <h4 className="text-white font-bold mb-2">3. Disclaimer</h4>
                                <p className="mb-4">The materials on DAEYEON ENG's website are provided on an 'as is' basis. DAEYEON ENG makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
                            </div>
                        }
                    />
                )}
            </AnimatePresence>
        </>
    );
}
