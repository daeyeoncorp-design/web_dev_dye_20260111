"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { TRANSLATIONS, Language } from "@/constants/translations";

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (typeof TRANSLATIONS)["en"];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    // Load language from localStorage on mount
    useEffect(() => {
        const storedLang = localStorage.getItem("language") as Language;
        if (storedLang && (storedLang === "en" || storedLang === "ko")) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLanguage(storedLang);
        }
    }, []);

    const toggleLanguage = () => {
        setLanguage((prev) => {
            const newLang = prev === "en" ? "ko" : "en";
            localStorage.setItem("language", newLang);
            return newLang;
        });
    };

    const t = TRANSLATIONS[language];

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
