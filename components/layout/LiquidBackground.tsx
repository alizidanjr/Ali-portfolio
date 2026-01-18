"use client";

import { motion } from "framer-motion";

export function LiquidBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
            {/* Liquid Blobs */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 100, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px]"
            />

            <motion.div
                animate={{
                    x: [0, -120, 80, 0],
                    y: [0, 100, -80, 0],
                    scale: [1, 0.8, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/10 blur-[120px]"
            />

            <motion.div
                animate={{
                    x: [0, 80, -100, 0],
                    y: [0, -100, 50, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]"
            />

            {/* Subtle Grain Overlay for authenticity */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
