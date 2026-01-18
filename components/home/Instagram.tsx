"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram as InstagramIcon, Heart, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

interface InstagramPost {
    id: string;
    mediaUrl: string;
    mediaType: string;
    permalink: string;
    caption: string;
    likes: number;
    comments: number;
}


export function Instagram() {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeed() {
            try {
                const response = await fetch("/api/instagram");
                const data = await response.json();
                if (data.posts) {
                    setPosts(data.posts);
                }
            } catch (error) {
                console.error("Failed to fetch Instagram feed:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchFeed();
    }, []);

    return (
        <section className="py-24 px-4 md:px-12 relative z-10 min-h-screen overflow-hidden">
            {/* Local "Mixed Color" Liquid Blobs for this section */}
            <div className="absolute inset-0 -z-10 pointer-events-none opacity-50">
                <motion.div
                    animate={{ x: [0, 50, -50, 0], y: [0, -30, 30, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-purple-600/20 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{ x: [0, -50, 50, 0], y: [0, 30, -30, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-pink-500/20 blur-[100px] rounded-full"
                />
            </div>

            <div className="max-w-7xl mx-auto glass-section rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-clip-text text-transparent drop-shadow-sm">
                            Instagram
                        </h2>
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full glass-morphism border-primary/20 hover:border-primary hover:bg-primary/10 transition-all gap-2"
                            asChild
                        >
                            <a href="https://instagram.com/alizidanjr" target="_blank" rel="noopener noreferrer">
                                Follow @alizidanjr
                                <ExternalLink className="w-4 h-4 shadow-primary/30" />
                            </a>
                        </Button>
                    </motion.div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonLoader key={i} className="aspect-square rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <AnimatePresence>
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative aspect-square overflow-hidden rounded-2xl bg-muted"
                                >
                                    <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                        <Image
                                            src={post.mediaUrl}
                                            alt={post.caption || "Instagram Post"}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            unoptimized
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/40 glass-morphism opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center border-none z-20">
                                            <div className="flex items-center gap-4 text-white mb-4 font-black text-glow">
                                                <div className="flex items-center gap-1.5">
                                                    <Heart className="w-5 h-5 fill-current text-primary" />
                                                    <span>{post.likes > 999 ? (post.likes / 1000).toFixed(1) + 'k' : post.likes}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MessageCircle className="w-5 h-5 fill-current text-primary" />
                                                    <span>{post.comments}</span>
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-full glass-card text-primary border-primary/20">
                                                <ExternalLink className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </a>
                                </motion.div>
                            ))}
                            {/* Fill Gaps / Missing Post Card */}
                            {posts.length > 0 && posts.length % 6 !== 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="group relative aspect-square overflow-hidden rounded-2xl glass-card flex flex-col items-center justify-center p-6 text-center border-primary/20 hover:border-primary/50 transition-all"
                                >
                                    <InstagramIcon className="w-10 h-10 text-primary mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-4">Explore More Stories</p>
                                    <Button size="sm" variant="outline" className="rounded-full text-[10px] h-8 glass-morphism border-primary/30" asChild>
                                        <a href="https://instagram.com/alizidanjr" target="_blank" rel="noopener noreferrer">Follow Now</a>
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Footer Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 p-8 rounded-[2rem] glass-morphism border-primary/20 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl shadow-primary/10 transition-all hover:scale-[1.01]"
                >
                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 text-glow">Join the journey</h3>
                        <p className="text-primary/80 font-medium">Daily behind-the-scenes and new releases.</p>
                    </div>

                    <Button
                        size="lg"
                        className="relative z-10 rounded-full font-black uppercase tracking-widest px-10 h-16 shadow-xl hover:scale-105 transition-all bg-primary text-primary-foreground"
                        asChild
                    >
                        <a href="https://instagram.com/alizidanjr" target="_blank" rel="noopener noreferrer">
                            Visit Profile
                        </a>
                    </Button>

                    <InstagramIcon className="absolute -right-10 -bottom-10 w-64 h-64 text-primary/10 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                </motion.div>
            </div>
        </section>

    );
}
