"use client";

import { BookingForm } from "@/components/booking/BookingForm";
import { motion } from "framer-motion";

export function BookingContent() {
    return (
        <section className="py-24 px-4 md:px-12 relative z-10 min-h-screen flex items-start md:items-center justify-center">
            <div className="max-w-7xl mx-auto glass-section rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center mb-10 md:mb-16">
                        <h1 className="text-4xl md:text-7xl font-black mb-4 text-white uppercase tracking-tighter text-glow">
                            Book <span className="text-primary italic">Now</span>
                        </h1>
                        <p className="text-neutral-400 font-medium text-sm md:text-lg uppercase tracking-widest">
                            Let&apos;s create something extraordinary.
                        </p>
                    </div>

                    <div className="glass-card rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 border-white/10">
                        <BookingForm />
                    </div>
                </motion.div>
            </div>
        </section>


    );
}
