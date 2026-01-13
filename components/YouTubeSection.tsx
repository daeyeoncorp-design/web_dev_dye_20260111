"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function YouTubeSection() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Play video
                    if (iframeRef.current && iframeRef.current.contentWindow) {
                        iframeRef.current.contentWindow.postMessage(
                            '{"event":"command","func":"playVideo","args":""}',
                            "*"
                        );
                        setIsPlaying(true);
                    }
                } else {
                    // Pause video
                    if (iframeRef.current && iframeRef.current.contentWindow) {
                        iframeRef.current.contentWindow.postMessage(
                            '{"event":"command","func":"pauseVideo","args":""}',
                            "*"
                        );
                        setIsPlaying(false);
                    }
                }
            },
            {
                threshold: 0.6, // 60% visibility required to play
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <section className="relative w-full bg-[#050505] py-32 flex justify-center items-center">
            <div
                ref={containerRef}
                className="w-full max-w-5xl px-6 md:px-12"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                >
                    <iframe
                        ref={iframeRef}
                        className="w-full h-full object-cover"
                        src="https://www.youtube.com/embed/LZ_JNHsAptk?enablejsapi=1&mute=1&rel=0&modestbranding=1"
                        title="DAEYEON ENG Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />

                    {/* YouTube Channel Link Overlay */}
                    <a
                        href="https://www.youtube.com/@daeyeoneng6647"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-6 right-6 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-red-600 hover:border-red-500 transition-all duration-300 group/yt"
                    >
                        <svg className="w-6 h-6 text-red-500 group-hover/yt:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                        <span className="text-white text-sm font-medium pr-1">DAEYEON ENG</span>
                    </a>

                    {/* Optional Overlay when paused (if needed, but for now we rely on the iframe thumbnail) */}
                </motion.div>
            </div>
        </section>
    );
}
