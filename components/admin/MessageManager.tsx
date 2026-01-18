"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp
} from "firebase/firestore";
import {
    Mail,
    Trash2,
    ChevronDown,
    Inbox,
    RefreshCw,
    Search,
    Filter,
    CheckCircle2,
    Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface EmailMessage {
    id: string;
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
    receivedAt: Timestamp;
    status: "unread" | "read";
}

export function MessageManager() {
    const [messages, setMessages] = useState<EmailMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "read" | "unread">("all");

    useEffect(() => {
        const q = query(collection(db, "received_emails"), orderBy("receivedAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as EmailMessage));
            setMessages(msgs);
            setLoading(false);
        }, (err) => {
            console.error("Snapshot error:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleReadStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "unread" ? "read" : "unread";
        try {
            await updateDoc(doc(db, "received_emails", id), {
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await deleteDoc(doc(db, "received_emails", id));
            if (expandedId === id) setExpandedId(null);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch =
            msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.text?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || msg.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-neutral-400">Loading messages...</p>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <Inbox className="w-12 h-12 text-neutral-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
                <p className="text-neutral-400 max-w-sm text-center">
                    Incoming emails to your domain will appear here automatically.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Archive ({filteredMessages.length})
                </h2>

                <div className="flex flex-1 max-w-2xl gap-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer hover:bg-white/10"
                    >
                        <option value="all" className="bg-neutral-900">All Status</option>
                        <option value="unread" className="bg-neutral-900">Unread</option>
                        <option value="read" className="bg-neutral-900">Read</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${expandedId === msg.id
                            ? "bg-white/10 border-primary/30"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                            }`}
                    >
                        {/* Status Indicator */}
                        {msg.status === "unread" && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                        )}

                        <div className="p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() => {
                                        setExpandedId(expandedId === msg.id ? null : msg.id);
                                        if (msg.status === "unread") toggleReadStatus(msg.id, "unread");
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-sm font-bold ${msg.status === "unread" ? "text-white" : "text-neutral-400"}`}>
                                            {msg.from}
                                        </span>
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-neutral-400">
                                            {format(msg.receivedAt.toDate(), "MMM dd, HH:mm")}
                                        </span>
                                    </div>
                                    <h3 className={`font-medium ${msg.status === "unread" ? "text-primary" : "text-neutral-300"}`}>
                                        {msg.subject || "(No Subject)"}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-neutral-400 hover:text-white"
                                        onClick={() => toggleReadStatus(msg.id, msg.status)}
                                    >
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-neutral-400 hover:text-destructive"
                                        onClick={() => deleteMessage(msg.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className={`h-8 w-8 transition-transform ${expandedId === msg.id ? "rotate-180" : ""}`}
                                        onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedId === msg.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-6 pt-6 border-t border-white/10"
                                >
                                    <div className="bg-black/20 rounded-xl p-4 mb-4 text-sm font-mono text-neutral-400 overflow-x-auto">
                                        <p>From: {msg.from}</p>
                                        <p>To: {msg.to}</p>
                                        <p>Date: {format(msg.receivedAt.toDate(), "PPPPpppp")}</p>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-6 min-h-[100px] text-neutral-200">
                                        {msg.html ? (
                                            <div
                                                dangerouslySetInnerHTML={{ __html: msg.html }}
                                                className="prose prose-invert max-w-none prose-sm overflow-hidden"
                                            />
                                        ) : (
                                            <pre className="whitespace-pre-wrap font-sans text-sm">
                                                {msg.text}
                                            </pre>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
