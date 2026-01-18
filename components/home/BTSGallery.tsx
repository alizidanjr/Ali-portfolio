"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Film, Users, Zap } from "lucide-react";

const btsItems = [
    {
        id: "1",
        type: "photo",
        src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
        title: "Portrait Prep",
        desc: "Setting up the lighting for a studio portrait session.",
        category: "setup"
    },
    {
        id: "2",
        type: "photo",
        src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
        title: "Gear Check",
        desc: "Checking the lenses before the outdoor shoot.",
        category: "gear"
    },
    {
        id: "3",
        type: "photo",
        src: "https://images.unsplash.com/photo-1493119508027-2b584f234d6c?q=80&w=800&auto=format&fit=crop",
        title: "Editing Flow",
        desc: "Post-production color grading for the music video.",
        category: "edit"
    },
    {
        id: "4",
        type: "photo",
        src: "https://images.unsplash.com/photo-1542038784424-fa00ed499837?q=80&w=800&auto=format&fit=crop",
        title: "On Location",
        desc: "Finding the perfect angle in the city streets.",
        category: "setup"
    },
    {
        id: "5",
        type: "photo",
        src: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=800&auto=format&fit=crop",
        title: "Crew Vibes",
        desc: "Collaborating with the team on a commercial project.",
        category: "team"
    },
    {
        id: "6",
        type: "photo",
        src: "https://images.unsplash.com/photo-1478059425650-ca02c91836f6?q=80&w=800&auto=format&fit=crop",
        title: "Final Review",
        desc: "Walking the client through the final edit.",
        category: "team"
    },
];

const categories = [
    { id: "all", label: "All Access", icon: Zap },
    { id: "setup", label: "Setups", icon: Camera },
    { id: "gear", label: "Equipment", icon: Film },
    { id: "edit", label: "Post-Pro", icon: Film },
    { id: "team", label: "Team", icon: Users },
];

export function BTSGallery() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedItem, setSelectedItem] = useState<typeof btsItems[0] | null>(null);

    const filteredItems = selectedCategory === "all"
        ? btsItems
        : btsItems.filter(item => item.category === selectedCategory);

    return (
        <section className="py-24 px-4 md:px-12 relative z-10 min-h-screen">
            <div className="max-w-7xl mx-auto glass-section rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <span className="text-primary text-sm font-bold uppercase tracking-[0.4em] mb-4 block">Process</span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-6 text-glow">
                        Behind The <span className="text-primary italic">Scenes</span>
                    </h2>
                    <p className="text-neutral-400 max-w-2xl text-lg font-medium">
                        Take a look at what happens behind the camera. From early sketches and equipment setups to the final editing room.
                    </p>
                </motion.div>


                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-12">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${selectedCategory === cat.id
                                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(255,102,0,0.3)] scale-105"
                                    : "glass-morphism text-neutral-400 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="group relative aspect-[4/3] rounded-3xl overflow-hidden glass-card cursor-pointer border-white/5"
                                onClick={() => setSelectedItem(item)}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.title}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 glass-morphism border-none" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-20" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-30">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-primary transition-colors text-glow">
                                        {item.title}
                                    </h3>
                                    <p className="text-neutral-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/98 backdrop-blur-2xl flex items-center justify-center p-6"
                        onClick={() => setSelectedItem(null)}
                    >
                        <button
                            className="absolute top-10 right-10 w-14 h-14 rounded-full bg-neutral-900 hover:bg-primary transition-colors flex items-center justify-center text-white"
                            onClick={() => setSelectedItem(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full items-center" onClick={e => e.stopPropagation()}>
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10"
                            >
                                <Image
                                    src={selectedItem.src}
                                    alt={selectedItem.title}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <span className="text-primary font-black uppercase tracking-[0.5em] text-sm">Category: {selectedItem.category}</span>
                                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                                        {selectedItem.title}
                                    </h2>
                                </div>
                                <div className="h-1 w-24 bg-primary rounded-full shadow-[0_0_20px_rgba(255,102,0,0.5)]" />
                                <p className="text-xl text-neutral-400 leading-relaxed font-medium">
                                    {selectedItem.desc}
                                </p>
                                <div className="flex gap-4 pt-4">
                                    <div className="px-6 py-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 font-bold uppercase tracking-widest text-xs">
                                        ISO 100
                                    </div>
                                    <div className="px-6 py-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 font-bold uppercase tracking-widest text-xs">
                                        f/2.8
                                    </div>
                                    <div className="px-6 py-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 font-bold uppercase tracking-widest text-xs">
                                        1/250s
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>

    );
}
