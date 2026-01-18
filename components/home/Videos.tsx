"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Loader2, X } from "lucide-react";
import { getPortfolioVideos, PortfolioVideo } from "@/lib/storage";

// Video Card Component with Lazy Loading
function VideoCard({ video, index, onClick }: { video: PortfolioVideo; index: number; onClick: () => void }) {
    const [isInView, setIsInView] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: "200px" } // Load a bit before it comes into view
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group cursor-pointer"
            onClick={onClick}
        >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 border border-border/50 hover:border-primary/50 transition-all duration-500">
                {/* Video Preview - Only set src when in view */}
                {isInView ? (
                    <video
                        src={`${video.videoUrl}#t=1`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        muted
                        playsInline
                        preload="metadata"
                    />
                ) : (
                    <div className="w-full h-full bg-muted animate-pulse" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="w-16 h-16 rounded-full glass-card flex items-center justify-center shadow-2xl shadow-black/50 border border-white/20"
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 100, 0, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Play className="w-7 h-7 text-primary fill-current ml-1 drop-shadow-[0_0_10px_rgba(255,100,0,0.5)]" />
                    </motion.div>
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">
                        {video.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span>Click to play</span>
                    </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10 glass-morphism border-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                </div>
            </div>
        </motion.div>
    );
}

export function Videos() {
    const [videos, setVideos] = useState<PortfolioVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<PortfolioVideo | null>(null);

    useEffect(() => {
        async function fetchVideos() {
            try {
                const fetchedVideos = await getPortfolioVideos();
                if (fetchedVideos.length > 0) {
                    setVideos(fetchedVideos);
                } else {
                    setVideos([
                        { id: "1", title: "Cinematic Reel", thumbnail: "", videoUrl: "", duration: "2:30" },
                        { id: "2", title: "Commercial Work", thumbnail: "", videoUrl: "", duration: "1:45" },
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch videos:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchVideos();
    }, []);

    return (
        <>
            <section id="videos" className="py-24 px-4 md:px-12 relative z-10 min-h-screen">
                <div className="max-w-7xl mx-auto glass-section rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-glow">
                            Cinematics
                        </h1>
                        <p className="text-primary font-bold tracking-[0.3em] uppercase mt-4 text-sm">Motion Portfolio</p>
                    </motion.div>


                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <p className="text-muted-foreground">Loading videos...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {videos.map((video, index) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    index={index}
                                    onClick={() => setSelectedVideo(video)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Fullscreen Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
                        onClick={() => setSelectedVideo(null)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Video Title */}
                        <div className="absolute top-6 left-6 z-10">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">{selectedVideo.title}</h2>
                        </div>

                        {/* Video Player */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-5xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
                                <video
                                    src={selectedVideo.videoUrl}
                                    controls
                                    autoPlay
                                    className="w-full max-h-[80vh] object-contain bg-black"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
