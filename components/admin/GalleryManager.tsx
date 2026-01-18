"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Upload,
    Loader2,
    Plus,
    FolderPlus,
    Image as ImageIcon,
    CheckCircle,
    AlertCircle,
    X,
    Pencil,
    Check
} from "lucide-react";
import { uploadFile, listGalleries, Gallery, renameGallery } from "@/lib/admin-storage";

export function GalleryManager() {
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newGalleryName, setNewGalleryName] = useState("");
    const [selectedGallery, setSelectedGallery] = useState<string>("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [renaming, setRenaming] = useState<string | null>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        setLoading(true);
        const fetchedGalleries = await listGalleries();
        setGalleries(fetchedGalleries);
        setLoading(false);
    };

    const handleCreateGallery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGalleryName.trim()) return;

        const folderName = newGalleryName.trim().replace(/\s+/g, "_").toLowerCase();

        const placeholderBlob = new Blob([""], { type: "text/plain" });
        const placeholderFile = new File([placeholderBlob], ".placeholder", { type: "text/plain" });

        try {
            setUploading(true);
            await uploadFile(placeholderFile, `photos/${folderName}/.placeholder`);
            setMessage({ type: "success", text: `Gallery "${newGalleryName}" created successfully!` });
            setNewGalleryName("");
            await fetchGalleries();
        } catch {
            setMessage({ type: "error", text: "Failed to create gallery" });
        } finally {
            setUploading(false);
        }
    };

    const handleUploadPhotos = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGallery || selectedFiles.length === 0) return;

        setUploading(true);
        setMessage(null);

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const fileName = `${Date.now()}_${file.name}`;
                await uploadFile(file, `photos/${selectedGallery}/${fileName}`);
            }
            setMessage({ type: "success", text: `${selectedFiles.length} photo(s) uploaded successfully!` });
            setSelectedFiles([]);
            await fetchGalleries();
        } catch {
            setMessage({ type: "error", text: "Failed to upload photos" });
        } finally {
            setUploading(false);
        }
    };

    const startEditing = (gallery: Gallery) => {
        setEditingId(gallery.id);
        setEditName(gallery.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditName("");
    };

    const handleRenameGallery = async (gallery: Gallery) => {
        if (!editName.trim() || editName === gallery.name) {
            cancelEditing();
            return;
        }

        setRenaming(gallery.id);
        setMessage(null);

        try {
            await renameGallery(gallery.id, editName.trim());
            setMessage({ type: "success", text: "Gallery renamed successfully!" });
            cancelEditing();
            await fetchGalleries();
        } catch {
            setMessage({ type: "error", text: "Failed to rename gallery" });
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
            file.type.startsWith("image/")
        );

        if (files.length > 0) {
            setSelectedFiles(prev => [...prev, ...files]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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

            {/* Create New Gallery */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <FolderPlus className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Create New Gallery</h3>
                </div>
                <form onSubmit={handleCreateGallery} className="flex gap-4">
                    <Input
                        value={newGalleryName}
                        onChange={(e) => setNewGalleryName(e.target.value)}
                        placeholder="Gallery name (e.g., Wedding 2024)"
                        className="flex-1 bg-background"
                    />
                    <Button
                        type="submit"
                        disabled={uploading || !newGalleryName.trim()}
                        className="bg-primary text-primary-foreground"
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        <span className="ml-2">Create</span>
                    </Button>
                </form>
            </div>

            {/* Upload Photos with Drag & Drop */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Upload Photos to Gallery</h3>
                </div>
                <form onSubmit={handleUploadPhotos} className="space-y-4">
                    <div>
                        <Label className="block mb-2">Select Gallery</Label>
                        {loading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading galleries...
                            </div>
                        ) : (
                            <select
                                value={selectedGallery}
                                onChange={(e) => setSelectedGallery(e.target.value)}
                                className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground"
                            >
                                <option value="">-- Select a gallery --</option>
                                {galleries.map((gallery) => (
                                    <option key={gallery.id} value={gallery.id}>
                                        {gallery.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Drag & Drop Zone */}
                    <div>
                        <Label className="block mb-2">Drop Photos Here</Label>
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
                                accept="image/*"
                                multiple
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className={`w-10 h-10 mx-auto mb-4 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                            <p className="text-foreground font-medium">
                                {isDragging ? "Drop images here!" : "Drag & drop images here"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                or click to browse
                            </p>
                        </div>
                    </div>

                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                            <Label>{selectedFiles.length} file(s) selected</Label>
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={uploading || !selectedGallery || selectedFiles.length === 0}
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
                                Upload {selectedFiles.length} Photo{selectedFiles.length !== 1 ? "s" : ""}
                            </>
                        )}
                    </Button>
                </form>
            </div>

            {/* Existing Galleries */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Existing Galleries</h3>
                {loading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                    </div>
                ) : galleries.length === 0 ? (
                    <p className="text-muted-foreground">No galleries yet. Create one above!</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleries.map((gallery) => (
                            <div
                                key={gallery.id}
                                className="relative aspect-square bg-muted rounded-lg overflow-hidden group"
                            >
                                {gallery.coverImage ? (
                                    <Image
                                        src={gallery.coverImage}
                                        alt={gallery.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FolderPlus className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-start justify-end p-3">
                                    {editingId === gallery.id ? (
                                        <div className="w-full flex items-center gap-1">
                                            <Input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="h-7 text-xs bg-background/80"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleRenameGallery(gallery);
                                                    if (e.key === "Escape") cancelEditing();
                                                }}
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleRenameGallery(gallery)}
                                                disabled={renaming === gallery.id}
                                                className="h-7 w-7"
                                            >
                                                {renaming === gallery.id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin text-white" />
                                                ) : (
                                                    <Check className="w-3 h-3 text-green-500" />
                                                )}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={cancelEditing}
                                                className="h-7 w-7"
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="w-full flex items-center justify-between">
                                            <span className="text-white font-medium text-sm truncate flex-1">
                                                {gallery.name}
                                            </span>
                                            <button
                                                onClick={() => startEditing(gallery)}
                                                className="p-1 hover:bg-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Pencil className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
