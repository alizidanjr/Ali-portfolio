"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Upload,
    Loader2,
    Trash2,
    Video,
    CheckCircle,
    AlertCircle,
    Play,
    X,
    Pencil,
    Check
} from "lucide-react";
import { uploadFile, deleteFile, listVideosAdmin, renameVideo } from "@/lib/admin-storage";

interface VideoItem {
    id: string;
    name: string;
    url: string;
    path: string;
}

export function VideoManager() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [renaming, setRenaming] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [videoTitle, setVideoTitle] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        setLoading(true);
        const fetchedVideos = await listVideosAdmin();
        setVideos(fetchedVideos);
        setLoading(false);
    };

    const handleUploadVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        setMessage(null);

        try {
            const fileName = videoTitle
                ? `${videoTitle.replace(/\s+/g, "_")}_${Date.now()}.${selectedFile.name.split(".").pop()}`
                : `${Date.now()}_${selectedFile.name}`;

            await uploadFile(selectedFile, `videos/${fileName}`);
            setMessage({ type: "success", text: "Video uploaded successfully!" });
            setSelectedFile(null);
            setVideoTitle("");
            await fetchVideos();
        } catch {
            setMessage({ type: "error", text: "Failed to upload video" });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteVideo = async (video: VideoItem) => {
        if (!confirm(`Are you sure you want to delete "${video.name}"?`)) return;

        setDeleting(video.id);
        setMessage(null);

        try {
            await deleteFile(video.path);
            setMessage({ type: "success", text: "Video deleted successfully!" });
            await fetchVideos();
        } catch {
            setMessage({ type: "error", text: "Failed to delete video" });
        } finally {
            setDeleting(null);
        }
    };

    const startEditing = (video: VideoItem) => {
        setEditingId(video.id);
        setEditName(video.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditName("");
    };

    const handleRenameVideo = async (video: VideoItem) => {
        if (!editName.trim() || editName === video.name) {
            cancelEditing();
            return;
        }

        setRenaming(video.id);
        setMessage(null);

        try {
            // Rename using Firestore
            await renameVideo(video.path, editName.trim());

            // Update local state immediately
            setVideos(prev => prev.map(v =>
                v.id === video.id ? { ...v, name: editName.trim() } : v
            ));

            setMessage({ type: "success", text: "Video renamed successfully!" });
            cancelEditing();
        } catch {
            setMessage({ type: "error", text: "Failed to rename video" });
        } finally {
            setRenaming(null);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith("video/")
        );

        if (files.length > 0) {
            setSelectedFile(files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
    };

    return (
        <div className="space-y-8">
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-4 rounded-lg ${message.type === "success"
                        ? "bg-green-500/10 border border-green-500/20 text-green-500"
                        : "bg-destructive/10 border border-destructive/20 text-destructive"
                        }`}
                >
                    {message.type === "success" ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    {message.text}
                </motion.div>
            )}

            {/* Upload Video with Drag & Drop */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Video className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Upload New Video</h3>
                </div>
                <form onSubmit={handleUploadVideo} className="space-y-4">
                    <div>
                        <Label htmlFor="video-title" className="block mb-2">Video Title (optional)</Label>
                        <Input
                            id="video-title"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            placeholder="e.g., Wedding Highlights 2024"
                            className="bg-background"
                        />
                    </div>

                    {/* Drag & Drop Zone */}
                    <div>
                        <Label className="block mb-2">Drop Video Here</Label>
                        <div
                            ref={dropZoneRef}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${isDragging
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                                }`}
                        >
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Video className={`w-10 h-10 mx-auto mb-4 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                            <p className="text-foreground font-medium">
                                {isDragging ? "Drop video here!" : "Drag & drop video here"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                or click to browse
                            </p>
                        </div>
                    </div>

                    {/* Selected Video Preview */}
                    {selectedFile && (
                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                            <div className="w-24 h-16 bg-black rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                                <video
                                    src={URL.createObjectURL(selectedFile)}
                                    className="w-full h-full object-cover"
                                    muted
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{selectedFile.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={clearSelectedFile}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                            </button>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={uploading || !selectedFile}
                        className="w-full bg-primary text-primary-foreground"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Video
                            </>
                        )}
                    </Button>
                </form>
            </div>

            {/* Existing Videos */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Existing Videos</h3>
                {loading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                    </div>
                ) : videos.length === 0 ? (
                    <p className="text-muted-foreground">No videos yet. Upload one above!</p>
                ) : (
                    <div className="space-y-4">
                        {videos.map((video) => (
                            <div
                                key={video.id}
                                className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                            >
                                <div className="w-24 h-16 bg-black rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                                    <video
                                        src={video.url}
                                        className="w-full h-full object-cover"
                                        muted
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    {editingId === video.id ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="h-8 bg-background"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleRenameVideo(video);
                                                    if (e.key === "Escape") cancelEditing();
                                                }}
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleRenameVideo(video)}
                                                disabled={renaming === video.id}
                                                className="h-8 w-8"
                                            >
                                                {renaming === video.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                )}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={cancelEditing}
                                                className="h-8 w-8"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <h4 className="font-medium truncate">{video.name}</h4>
                                            <a
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline flex items-center gap-1"
                                            >
                                                <Play className="w-3 h-3" />
                                                Preview
                                            </a>
                                        </>
                                    )}
                                </div>
                                {editingId !== video.id && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => startEditing(video)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDeleteVideo(video)}
                                            disabled={deleting === video.id}
                                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                        >
                                            {deleting === video.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
