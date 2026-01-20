"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const [errorMsg, setErrorMsg] = useState("There was a problem verifying your identity.");

    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            console.error("Auth error:", error);
            // Optional: Map error codes to user-friendly messages here
            if (error === "AuthCodeExchangeError") {
                setErrorMsg("We couldn't exchange the authentication code. Please try again.");
            }
        }
    }, [searchParams]);

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
            <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">Authentication Failed</h1>
            <p className="text-white/60 mb-8">{errorMsg}</p>

            <div className="space-y-3">
                <Link
                    href="/login"
                    className="block w-full bg-white text-black font-semibold py-3.5 px-4 rounded-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505] focus:ring-white transition-all duration-200"
                >
                    Try Again
                </Link>
                <Link
                    href="/"
                    className="block w-full bg-white/5 text-white font-medium py-3.5 px-4 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[#050505]/80 backdrop-blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[100px] animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <Suspense fallback={
                    <div className="text-white text-center p-8 bg-white/5 rounded-2xl border border-white/10">
                        Loading...
                    </div>
                }>
                    <AuthErrorContent />
                </Suspense>
            </motion.div>
        </div>
    );
}
