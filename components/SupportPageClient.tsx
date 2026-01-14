"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Tables } from "@/types/supabase";
import { useSearchParams } from "next/navigation";

type Resource = Tables<"resources">;

type ProcessItem = {
    id: string;
    name: string;
    unit: 'sheet' | 'row';
    cycleTime: number | string;
    machines: number;
};

export default function SupportPageClient({
    resources
}: {
    resources: Resource[]
}) {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'resources' | 'contact' | 'location' | 'tact_time'>('tact_time');

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "contact" || tab === "location" || tab === "resources" || tab === "tact_time") {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Calculator State
    const [calcConfig, setCalcConfig] = useState<{
        workHours: number | string;
        workDays: number | string;
        efficiency: number | string;
        rowsPerSheet: number | string;
        yearlyTarget: number | string;
    }>({
        workHours: 8,
        workDays: 20,
        efficiency: 85,
        rowsPerSheet: 12,
        yearlyTarget: 3
    });

    const [processes, setProcesses] = useState<ProcessItem[]>([
        { id: 'p1', name: 'Screen Printing', unit: 'sheet', cycleTime: 20, machines: 1 },
        { id: 'p2', name: 'Laminating 1', unit: 'sheet', cycleTime: 20, machines: 1 },
        { id: 'p3', name: 'Dispensing', unit: 'sheet', cycleTime: 20, machines: 1 },
        { id: 'p4', name: 'Drying', unit: 'sheet', cycleTime: 20, machines: 1 },
        { id: 'p5', name: 'Laminating 2', unit: 'sheet', cycleTime: 20, machines: 1 },
        { id: 'p6', name: 'Row Slitting', unit: 'sheet', cycleTime: 20, machines: 1 },
        { id: 'p7', name: 'Cell Slitting', unit: 'row', cycleTime: 7, machines: 4 },
        { id: 'p8', name: 'Capping', unit: 'row', cycleTime: 3.5, machines: 2 },
        { id: 'p9', name: 'Cartoning', unit: 'row', cycleTime: 1.5, machines: 1 },
    ]);

    // Filter resources by type for better organization if needed, or just list all
    // For this design, let's group them or just list them. The design had separate icons.

    // Handle Config Change
    const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Allow empty string to let user delete content
        if (value === "") {
            setCalcConfig(prev => ({
                ...prev,
                [name]: ""
            }));
            return;
        }

        setCalcConfig(prev => ({
            ...prev,
            [name]: Math.max(0, Number(value))
        }));
    };

    // Handle Process Change
    const updateProcess = (id: string, field: 'cycleTime' | 'machines', value: string | number) => {
        setProcesses(prev => prev.map(p => {
            if (p.id !== id) return p;

            if (value === "") {
                return { ...p, [field]: "" };
            }

            const numValue = Number(value);
            // Allow 0 temporarily while typing, but calculations will handle it
            return { ...p, [field]: numValue };
        }));
    };

    // Stats Calculation
    // Stats Calculation
    const getStats = () => {
        let maxEffectiveCycleTime = 0;
        let bottleneckProcess = '';

        // Safe accessors
        const rowsPerSheet = Number(calcConfig.rowsPerSheet) || 0;
        const workHours = Number(calcConfig.workHours) || 0;
        const workDays = Number(calcConfig.workDays) || 0;
        const efficiency = Number(calcConfig.efficiency) || 0;
        const yearlyTarget = Number(calcConfig.yearlyTarget) || 0;

        const processedData = processes.map(p => {
            let effectiveCT = 0;
            const cycleTime = Number(p.cycleTime) || 0;
            const machines = Number(p.machines) || 1; // Prevent division by zero

            if (p.unit === 'sheet') {
                effectiveCT = cycleTime / machines;
            } else {
                effectiveCT = (cycleTime * rowsPerSheet) / machines;
            }

            if (effectiveCT > maxEffectiveCycleTime) {
                maxEffectiveCycleTime = effectiveCT;
                bottleneckProcess = p.name;
            }

            return { ...p, effectiveCT };
        });

        const lineTactTime = maxEffectiveCycleTime;
        const sheetsPerHour = lineTactTime > 0 ? 3600 / lineTactTime : 0;
        const sheetsPerDay = sheetsPerHour * workHours * (efficiency / 100);
        const sheetsPerMonth = sheetsPerDay * workDays;
        const sheetsPerYear = sheetsPerMonth * 12;
        const bottlesPerYear = sheetsPerYear * rowsPerSheet;

        const isTargetMet = bottlesPerYear >= (yearlyTarget * 1000000);

        return {
            processedData,
            lineTactTime,
            bottleneckProcess,
            capacity: {
                hourly: sheetsPerHour,
                daily: sheetsPerDay,
                monthly: sheetsPerMonth,
                yearly: sheetsPerYear
            },
            isTargetMet
        };
    };

    const stats = getStats();

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
            id: 'tact_time', label: t.support_page.tabs.tact_time, icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" x2="16" y1="6" y2="6"></line><line x1="16" x2="16" y1="14" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>
            )
        },
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

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        company_website: '' // Honeypot field
    });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Determine error type based on status for localization
                if (response.status === 429) {
                    throw new Error(t.support_page.contact.messages.error_rate_limit);
                }
                throw new Error(t.support_page.contact.messages.error_generic);
            }

            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '', company_website: '' });
        } catch (error: any) {
            setSubmitStatus('error');
            // If the error message matches one of our keys, use it, otherwise fallback
            setErrorMessage(error.message);
        }
    };

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
            <div className="sticky top-16 z-30 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
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
                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        {/* Honeypot Field - Hidden */}
                                        <div className="hidden">
                                            <label>Website</label>
                                            <input
                                                type="text"
                                                name="company_website"
                                                value={formData.company_website}
                                                onChange={handleChange}
                                                tabIndex={-1}
                                                autoComplete="off"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-white/40 mb-2">{t.support_page.contact.name}</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-white/40 mb-2">{t.support_page.contact.email}</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">{t.support_page.contact.subject}</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-white/40 mb-2">{t.support_page.contact.message}</label>
                                            <textarea
                                                name="message"
                                                required
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:border-white/30 transition-colors"
                                            ></textarea>
                                        </div>

                                        {submitStatus === 'error' && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
                                                {errorMessage}
                                            </div>
                                        )}

                                        {submitStatus === 'success' && (
                                            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-sm">
                                                {t.support_page.contact.messages.success}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={submitStatus === 'loading'}
                                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submitStatus === 'loading' ? t.support_page.contact.messages.sending : t.support_page.contact.submit}
                                        </button>
                                    </form>
                                </div>
                                <div className="w-full md:w-1/3 space-y-8 pt-8 md:pt-0 md:border-l border-white/5 md:pl-12">
                                    <div>
                                        <h4 className="text-lg font-bold mb-4">{t.support_page.contact.info_title}</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs uppercase text-white/40 mb-1">{t.support_page.contact.email_label}</p>
                                                <a href="mailto:support@daeyeoncorp.com" className="text-blue-400 hover:text-blue-300">support@daeyeoncorp.com</a>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase text-white/40 mb-1">{t.support_page.contact.phone_label}</p>
                                                <p className="text-white">+82 031-526-9333</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase text-white/40 mb-1">Fax</p>
                                                <p className="text-white">+82 031-526-9334</p>
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
                                <div className="h-[400px] bg-[#222] relative flex items-center justify-center overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent("135-11, Dangha-ro, Namsa-eup, Cheoin-gu, Yongin-si, Gyeonggi-do, Korea")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
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

                    {activeTab === 'tact_time' && (
                        <motion.div
                            key="tact_time"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Configuration Panel */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Global Settings */}
                                    <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            Settings
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                            <div>
                                                <label className="block text-xs text-white/40 mb-1">{t.support_page.tact_calc.inputs.hours_day}</label>
                                                <div className="relative">
                                                    <input type="number" name="workHours" value={calcConfig.workHours} onChange={handleConfigChange} className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm" />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xs">hr</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-white/40 mb-1">{t.support_page.tact_calc.inputs.days_month}</label>
                                                <div className="relative">
                                                    <input type="number" name="workDays" value={calcConfig.workDays} onChange={handleConfigChange} className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm" />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xs">days</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-white/40 mb-1">{t.support_page.tact_calc.inputs.efficiency}</label>
                                                <div className="relative">
                                                    <input type="number" name="efficiency" value={calcConfig.efficiency} onChange={handleConfigChange} className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm" />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xs">%</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-white/40 mb-1">{t.support_page.tact_calc.inputs.rows_sheet}</label>
                                                <div className="relative">
                                                    <input type="number" name="rowsPerSheet" value={calcConfig.rowsPerSheet} onChange={handleConfigChange} className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm" />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xs">rows</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-green-400 mb-1">{t.support_page.tact_calc.inputs.target}</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        name="yearlyTarget"
                                                        value={calcConfig.yearlyTarget}
                                                        onChange={handleConfigChange}
                                                        className="w-full bg-green-900/10 border border-green-500/20 text-green-400 font-bold rounded-lg pl-3 pr-8 py-2 text-sm"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400/70 font-bold text-sm">M</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Process List */}
                                    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                                        <div className="grid grid-cols-12 gap-2 p-4 border-b border-white/10 text-xs uppercase font-bold text-white/40">
                                            <div className="col-span-4 md:col-span-3">{t.support_page.tact_calc.table.process}</div>
                                            <div className="col-span-2 hidden md:block">{t.support_page.tact_calc.table.unit}</div>
                                            <div className="col-span-3 md:col-span-2 text-center">{t.support_page.tact_calc.table.cycle_time}</div>
                                            <div className="col-span-3 md:col-span-3 text-center">{t.support_page.tact_calc.table.machines}</div>
                                            <div className="col-span-2 text-right hidden md:block text-blue-400">{t.support_page.tact_calc.table.effective}</div>
                                        </div>
                                        <div className="divide-y divide-white/5">
                                            {stats.processedData.map((p) => {
                                                const isBottleneck = p.name === stats.bottleneckProcess && !stats.isTargetMet;
                                                return (
                                                    <div key={p.id} className={`grid grid-cols-12 gap-2 p-4 items-center hover:bg-white/5 transition-colors ${isBottleneck ? 'bg-red-500/10' : ''}`}>
                                                        <div className="col-span-4 md:col-span-3 font-medium text-sm flex items-center gap-2">
                                                            {isBottleneck && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                                                            {p.name}
                                                        </div>
                                                        <div className="col-span-2 hidden md:block text-xs text-white/40 uppercase">{p.unit}</div>
                                                        <div className="col-span-3 md:col-span-2 flex justify-center">
                                                            <input
                                                                type="number"
                                                                value={p.cycleTime}
                                                                onChange={(e) => updateProcess(p.id, 'cycleTime', e.target.value)}
                                                                className="w-16 bg-black/20 border border-white/10 rounded text-center py-1 text-sm"
                                                            />
                                                        </div>
                                                        <div className="col-span-3 md:col-span-3 flex justify-center items-center gap-2">
                                                            <button onClick={() => updateProcess(p.id, 'machines', p.machines - 1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center">-</button>
                                                            <span className="w-8 text-center">{p.machines}</span>
                                                            <button onClick={() => updateProcess(p.id, 'machines', p.machines + 1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center">+</button>
                                                        </div>
                                                        <div className={`col-span-2 text-right hidden md:block font-mono text-sm ${isBottleneck ? 'text-red-400 font-bold' : 'text-blue-400/60'}`}>
                                                            {p.effectiveCT.toFixed(1)}s
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Panel */}
                                <div className="lg:col-span-1">
                                    <div className={`bg-gradient-to-br border border-white/10 rounded-2xl p-6 sticky top-24 ${stats.isTargetMet ? 'from-green-900/20 to-blue-900/20 border-green-500/30' : 'from-blue-900/20 to-purple-900/20'}`}>
                                        <h3 className="text-xl font-bold mb-6">{t.support_page.tact_calc.summary.title}</h3>

                                        <div className="space-y-6">
                                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                                <p className="text-sm text-white/60 mb-1">{t.support_page.tact_calc.summary.tact}</p>
                                                <p className="text-3xl font-bold text-white">{stats.lineTactTime.toFixed(1)} <span className="text-sm font-normal text-white/40">sec/sheet</span></p>
                                                {!stats.isTargetMet && (
                                                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
                                                        {t.support_page.tact_calc.summary.bottleneck}: {stats.bottleneckProcess}
                                                    </p>
                                                )}
                                                {stats.isTargetMet && (
                                                    <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                                        Target Met!
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                    <span className="text-white/60">{t.support_page.tact_calc.summary.hourly}</span>
                                                    <span className="font-mono">{Math.floor(stats.capacity.hourly).toLocaleString()} <span className="text-xs text-white/30">sheets</span></span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                    <span className="text-white/60">{t.support_page.tact_calc.summary.daily}</span>
                                                    <span className="font-mono font-bold text-blue-300">{Math.floor(stats.capacity.daily).toLocaleString()} <span className="text-xs text-white/30">sheets</span></span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                    <span className="text-white/60">{t.support_page.tact_calc.summary.monthly}</span>
                                                    <span className="font-mono">{Math.floor(stats.capacity.monthly).toLocaleString()} <span className="text-xs text-white/30">sheets</span></span>
                                                </div>
                                                <div className="pt-2">
                                                    <span className="block text-white/60 text-sm mb-1">{t.support_page.tact_calc.summary.yearly}</span>
                                                    <div className={`font-mono text-2xl font-bold ${stats.isTargetMet ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {Math.floor(stats.capacity.yearly).toLocaleString()} <span className="text-sm font-normal text-white/40">sheets</span>
                                                    </div>
                                                    <div className={`font-mono text-sm mt-1 flex items-center gap-2 ${stats.isTargetMet ? 'text-green-400/60' : 'text-white/40'}`}>
                                                        ≈ {Math.floor(stats.capacity.yearly * (Number(calcConfig.rowsPerSheet) || 0)).toLocaleString()} bottles
                                                        {stats.isTargetMet && (
                                                            <span className="text-[10px] uppercase border border-green-500/30 px-1 rounded bg-green-500/10">Goal Reached</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
