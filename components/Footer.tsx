"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();

    return (
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
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">{t.footer.links.about}</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">{t.footer.links.careers}</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">{t.footer.links.contact}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">{t.footer.legal_title}</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">{t.footer.links.privacy}</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">{t.footer.links.terms}</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>© {new Date().getFullYear()} DAEYEON ENG. {t.footer.rights}</p>
                <p>{t.footer.designed_by}</p>
            </div>
        </footer>
    );
}
