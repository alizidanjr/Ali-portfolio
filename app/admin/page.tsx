"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    LogOut,
    Image as ImageIcon,
    Video,
    LayoutDashboard,
    Mail
} from "lucide-react";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { VideoManager } from "@/components/admin/VideoManager";
import { MessageManager } from "@/components/admin/MessageManager";

type Tab = "gallery" | "videos" | "messages";

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("gallery");
    const [loggingOut, setLoggingOut] = useState(false);

    const checkAuth = useCallback(async () => {
        try {
            const response = await fetch("/api/auth/check");
            if (response.ok) {
                setAuthenticated(true);
            } else {
                router.push("/admin/login");
            }
        } catch {
            router.push("/admin/login");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/admin/login");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!authenticated) {
        return null;
    }

    return (
        <div className="min-h-[80vh] py-8 px-4 md:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-8 h-8 text-primary" />
                        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        {loggingOut ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <LogOut className="w-4 h-4" />
                        )}
                        <span className="ml-2 hidden md:inline">Logout</span>
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-border">
                    <button
                        onClick={() => setActiveTab("gallery")}
                        className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${activeTab === "gallery"
                            ? "text-primary border-primary"
                            : "text-muted-foreground border-transparent hover:text-foreground"
                            }`}
                    >
                        <ImageIcon className="w-4 h-4" />
                        Gallery
                    </button>
                    <button
                        onClick={() => setActiveTab("videos")}
                        className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${activeTab === "videos"
                            ? "text-primary border-primary"
                            : "text-muted-foreground border-transparent hover:text-foreground"
                            }`}
                    >
                        <Video className="w-4 h-4" />
                        Videos
                    </button>
                    <button
                        onClick={() => setActiveTab("messages")}
                        className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${activeTab === "messages"
                            ? "text-primary border-primary"
                            : "text-muted-foreground border-transparent hover:text-foreground"
                            }`}
                    >
                        <Mail className="w-4 h-4" />
                        Messages
                    </button>
                </div>

                {/* Content */}
                <div>
                    {activeTab === "gallery" && <GalleryManager />}
                    {activeTab === "videos" && <VideoManager />}
                    {activeTab === "messages" && <MessageManager />}
                </div>
            </motion.div>
        </div>
    );
}
