"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const DEFAULT_FRAME_COUNT = 12;

interface ImageSequenceProps {
    imagePrefix?: string;
    frameCount?: number;
    scrollStart?: number;
    scrollEnd?: number;
}

export default function ImageSequence({
    imagePrefix = "ex",
    frameCount = DEFAULT_FRAME_COUNT,
    scrollStart = 0,
    scrollEnd = 0.17
}: ImageSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const { scrollYProgress } = useScroll();

    // Transform scroll progress to image index
    const currentIndex = useTransform(
        scrollYProgress,
        [scrollStart, scrollEnd],
        [0, frameCount - 1],
        { clamp: true }
    );

    // Fade out logic: Starts slightly after sequence ends
    const opacity = useTransform(
        scrollYProgress,
        [scrollEnd + 0.01, scrollEnd + 0.13],
        [1, 0]
    );

    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `/assets/${imagePrefix}${i}.png`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setImages(loadedImages);
                }
            };
            loadedImages.push(img);
        }
    }, [imagePrefix, frameCount]);

    useEffect(() => {
        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas || images.length === 0) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const idx = Math.round(currentIndex.get());
            const safeIdx = Math.max(0, Math.min(frameCount - 1, idx));
            const image = images[safeIdx];

            if (!image) return;

            // Resize if needed
            if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            const imgRatio = image.width / image.height;
            const winRatio = canvas.width / canvas.height;

            let drawWidth, drawHeight, offsetX;
            const SCALE_FACTOR = 0.9; // Scale down slightly to leave space for Navbar

            // Calculate dimensions to "contain" (or cover)
            // Logic: we generally want it contained but large
            if (winRatio > imgRatio) {
                // Window wider -> fit by height
                drawHeight = canvas.height * SCALE_FACTOR;
                drawWidth = drawHeight * imgRatio;
            } else {
                // Window taller -> fit by width
                drawWidth = canvas.width * SCALE_FACTOR;
                drawHeight = drawWidth / imgRatio;
            }

            // Desktop (>768px): Shift to right side (70% mark) to balance left-aligned text
            // Mobile: Keep centered
            if (canvas.width > 768) {
                const centerX = canvas.width * 0.7;
                offsetX = centerX - (drawWidth / 2);
            } else {
                offsetX = (canvas.width - drawWidth) / 2;
            }

            const offsetY = (canvas.height - drawHeight) / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        };

        const unsubscribe = currentIndex.on("change", render);
        render();

        window.addEventListener("resize", render);
        return () => {
            unsubscribe();
            window.removeEventListener("resize", render);
        };
    }, [currentIndex, images, frameCount]);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-[#050505]">
            <motion.canvas ref={canvasRef} className="w-full h-full" style={{ opacity }} />
        </div>
    );
}
