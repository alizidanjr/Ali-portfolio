"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getPortfolioImages, PortfolioImage } from "@/lib/storage";
import { Loader2, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

// Fallback images if Firebase fetch fails
const fallbackItems = [
    { id: "1", type: "photo" as const, src: "https://images.unsplash.com/photo-1542038784424-fa00ed499837?q=80&w=800&auto=format&fit=crop", span: "md:col-span-1 md:row-span-1", category: "Commercial" },
    { id: "2", type: "photo" as const, src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop", span: "md:col-span-1 md:row-span-2", category: "Nature" },
    { id: "3", type: "photo" as const, src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=800&auto=format&fit=crop", span: "md:col-span-1 md:row-span-1", category: "Portraits" },
    { id: "4", type: "photo" as const, src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop", span: "md:col-span-2 md:row-span-2", category: "Portraits" },
    { id: "5", type: "photo" as const, src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop", span: "md:col-span-1 md:row-span-1", category: "Nature" },
    { id: "6", type: "photo" as const, src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop", span: "md:col-span-1 md:row-span-1", category: "Commercial" },
];

export function Gallery() {
    const [items, setItems] = useState<PortfolioImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", ...Array.from(new Set(items.map(item => item.category).filter(Boolean)))];

    useEffect(() => {
        async function fetchImages() {
            try {
                const images = await getPortfolioImages();
                if (images.length > 0) {
                    setItems(images);
                } else {
                    setItems(fallbackItems);
                }
            } catch (error) {
                console.error("Failed to fetch images:", error);
                setItems(fallbackItems);
            } finally {
                setLoading(false);
            }
        }

        fetchImages();
    }, []);

    const openLightbox = (index: number) => {
        setSelectedImageIndex(index);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = useCallback(() => {
        setSelectedImageIndex(null);
        document.body.style.overflow = "auto";
    }, []);

    const filteredItems = activeCategory === "All"
        ? items
        : items.filter(item => item.category === activeCategory);

    const nextImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % filteredItems.length);
        }
    }, [selectedImageIndex, filteredItems.length]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex - 1 + filteredItems.length) % filteredItems.length);
        }
    }, [selectedImageIndex, filteredItems.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImageIndex, closeLightbox, nextImage, prevImage]);

    return (
        <section id="gallery" className="py-24 px-4 md:px-12 relative z-10 min-h-screen">
            <div className="max-w-7xl mx-auto glass-section rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-5xl md:text-7xl font-black mb-4 text-white uppercase tracking-tighter text-glow">Gallery</h2>
                    <p className="text-primary font-bold tracking-[0.3em] uppercase text-sm">Captured Moments</p>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mt-8">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setActiveCategory(category as string);
                                    setSelectedImageIndex(null);
                                }}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${activeCategory === category
                                    ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(255,100,0,0.3)]"
                                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </motion.div>


                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonLoader key={i} className="rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    className={`relative group overflow-hidden rounded-xl cursor-pointer shadow-lg border border-border/10 hover:border-primary/50 transition-all duration-500 ${item.span}`}
                                    onClick={() => openLightbox(index)}
                                >
                                    <Image
                                        src={item.src}
                                        alt="Portfolio Item"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center glass-morphism border-none z-10">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            whileHover={{ scale: 1.1 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-16 h-16 rounded-full glass-card text-primary flex items-center justify-center border-white/20"
                                        >
                                            <Maximize2 className="w-8 h-8" />
                                        </motion.div>
                                        <span className="mt-4 text-primary font-bold tracking-[0.2em] uppercase text-sm text-glow">Expand Image</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {selectedImageIndex !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center"
                            onClick={closeLightbox}
                        >
                            {/* Close Button */}
                            <button
                                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-[110]"
                                onClick={closeLightbox}
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>

                            {/* Navigation Buttons */}
                            <button
                                className="absolute left-6 w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors z-[110]"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="w-8 h-8 text-white" />
                            </button>
                            <button
                                className="absolute right-6 w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors z-[110]"
                                onClick={nextImage}
                            >
                                <ChevronRight className="w-8 h-8 text-white" />
                            </button>

                            {/* Image Container */}
                            <motion.div
                                key={selectedImageIndex}
                                initial={{ scale: 0.9, opacity: 0, x: 20 }}
                                animate={{ scale: 1, opacity: 1, x: 0 }}
                                exit={{ scale: 0.9, opacity: 0, x: -20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="relative w-full h-full p-4 md:p-12 flex items-center justify-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={filteredItems[selectedImageIndex].src}
                                    alt="Lightbox Image"
                                    fill
                                    className="object-contain rounded-lg shadow-[0_0_50px_rgba(255,102,0,0.2)]"
                                />

                                {/* Counter */}
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/50 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                    <span className="text-white/80 font-mono text-sm tracking-widest">
                                        {selectedImageIndex + 1} <span className="mx-2 opacity-50">/</span> {filteredItems.length}
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
