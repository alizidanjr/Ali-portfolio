"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Download, FileText, User, Award, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutContent() {
    return (
        <section className="py-24 px-4 md:px-12 relative z-10 min-h-screen flex items-center justify-center">
            <div className="max-w-7xl mx-auto glass-section rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
                >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl glass-card border-white/10">
                        <Image
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
                            alt="Ali Zidan"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-2 text-glow">
                                ALI ZIDAN
                            </h1>
                            <h2 className="text-xl md:text-2xl font-bold tracking-[0.4em] uppercase text-primary/80">Visual Storyteller</h2>
                        </div>

                        <div className="h-1 w-24 bg-primary rounded-full shadow-[0_0_20px_rgba(255,102,0,0.5)]" />

                        <div className="space-y-6">
                            <p className="text-xl leading-relaxed text-white/80 font-medium">
                                I am a photographer and videographer based in the creative heart of the city.
                                My work is driven by a passion for capturing raw emotions and cinematic moments.
                            </p>
                            <p className="text-xl leading-relaxed text-white/80 font-medium">
                                With a focus on visual storytelling, I turn ordinary scenes into extraordinary narratives using light, shadow, and motion.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-8">
                            <div className="grid grid-cols-2 gap-8 text-sm font-black tracking-[0.2em] uppercase">
                                <div>
                                    <span className="block text-primary text-xs mb-2 opacity-60">Location</span>
                                    Cairo, Egypt
                                </div>
                                <div>
                                    <span className="block text-primary text-xs mb-2 opacity-60">Specialty</span>
                                    Direction & Edit
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] glass-morphism border-primary/20 bg-primary/5 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Comp Card 2024</h3>
                                    </div>
                                    <p className="text-sm text-white/60 mb-6 leading-relaxed">
                                        Download my latest professional comp card with full measurements and portfolio highlights.
                                    </p>
                                    <Button className="w-full rounded-full h-12 font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all bg-primary text-primary-foreground">
                                        <Download className="w-4 h-4" />
                                        Download PDF
                                    </Button>
                                </div>
                                <FileText className="absolute -right-8 -bottom-8 w-32 h-32 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Experience / Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
                >
                    {[
                        { icon: Award, label: "Experience", value: "8+ Years" },
                        { icon: Camera, label: "Projects", value: "500+" },
                        { icon: User, label: "Clients", value: "200+" },
                    ].map((stat, i) => (
                        <div key={i} className="p-8 rounded-3xl glass-card flex items-center gap-6 group hover:border-primary/30 transition-all">
                            <div className="p-4 rounded-2xl bg-white/5 text-primary group-hover:bg-primary/20 transition-all">
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>

    );
}
