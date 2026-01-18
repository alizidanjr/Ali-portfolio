"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Hero() {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchImages() {
            try {
                const response = await fetch("/api/instagram");
                const data = await response.json();
                if (data.posts && data.posts.length > 0) {
                    const urls = data.posts.map((p: { mediaUrl: string }) => p.mediaUrl);
                    setImages(urls);
                    // Pick a random starting image
                    const randomIndex = Math.floor(Math.random() * urls.length);
                    setCurrentIndex(randomIndex);
                } else {
                    // Fallback images if API is empty
                    setImages(["/images/hero-bg.png"]);
                }
            } catch (error) {
                console.error("Hero background fetch error:", error);
                setImages(["/images/hero-bg.png"]);
            }
        }
        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 6000); // Cycle every 6 seconds

        return () => clearInterval(interval);
    }, [images]);

    return (
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-black">
            {/* Dynamic Instagram Background */}
            <div className="absolute inset-0 z-0 scale-110">
                <AnimatePresence mode="wait">
                    {images.length > 0 && (
                        <motion.img
                            key={images[currentIndex]}
                            src={images[currentIndex]}
                            alt="Background"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 0.6, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="w-full h-full object-cover"
                        />
                    )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10" />
            </div>

            <div className="relative z-20 flex flex-col items-center">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-primary font-medium tracking-[0.5em] uppercase mb-12 text-xs md:text-sm border border-primary/30 px-6 py-2 rounded-full backdrop-blur-md bg-black/20"
                >
                    ALI ZIDAN
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{
                        duration: 1.8,
                        delay: 0.7,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                    className="text-8xl md:text-[12rem] lg:text-[16rem] font-bold leading-none mb-16 text-primary font-reem-kufi select-none drop-shadow-[0_0_50px_rgba(255,100,0,0.3)]"
                    dir="rtl"
                >
                    طـفل <span className="text-foreground opacity-80">حـر</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="flex flex-col md:flex-row gap-6 mt-8"
                >
                    <Button asChild size="lg" className="rounded-none px-12 text-lg h-16 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20">
                        <Link href="/booking">
                            Order Now
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-none px-12 text-lg h-16 border-white/20 text-white hover:bg-white hover:text-black font-black uppercase tracking-widest backdrop-blur-md transition-all hover:scale-105 active:scale-95">
                        <Link href="/gallery">
                            Explore Work
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Cinematic Noise Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-30" />
        </section>
    );
}


