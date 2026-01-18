"use client";

import { motion } from "framer-motion";

interface SkeletonLoaderProps {
    className?: string;
}

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
    return (
        <div className={`relative overflow-hidden bg-white/5 ${className}`}>
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                style={{ skewX: "-20deg" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-30" />
        </div>
    );
}
