import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, getBytes } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { storage, db } from "./firebase";

export interface Gallery {
    id: string;
    name: string;
    coverImage?: string;
    createdAt: number;
}

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
    file: File,
    path: string,
    // onProgress parameter removed because it was unused
): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
}

/**
 * List all folders (galleries) in the photos directory
 */
export async function listGalleries(): Promise<Gallery[]> {
    try {
        const photosRef = ref(storage, "photos");
        const result = await listAll(photosRef);

        const galleries: Gallery[] = [];

        for (const folder of result.prefixes) {
            // Get cover image (first image in folder)
            const folderResult = await listAll(folder);
            let coverImage: string | undefined;

            if (folderResult.items.length > 0) {
                const firstImage = folderResult.items.find(item =>
                    item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                );
                if (firstImage) {
                    coverImage = await getDownloadURL(firstImage);
                }
            }

            galleries.push({
                id: folder.name,
                name: folder.name.replace(/_/g, " "),
                coverImage,
                createdAt: Date.now(),
            });
        }

        return galleries;
    } catch (error) {
        console.error("Error listing galleries:", error);
        return [];
    }
}

/**
 * List all videos in the videos directory (including subfolders)
 */
export async function listVideosAdmin(): Promise<{ id: string; name: string; url: string; path: string }[]> {
    try {
        const videosRef = ref(storage, "videos");
        const result = await listAll(videosRef);

        const videos: { id: string; name: string; url: string; path: string }[] = [];

        // Get videos from root folder
        for (const item of result.items) {
            if (item.name.match(/\.(mp4|webm|mov|avi)$/i)) {
                const url = await getDownloadURL(item);
                const path = item.fullPath;

                // Check for custom display name in Firestore
                let displayName = item.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
                const storedName = await getVideoDisplayName(path);
                if (storedName) {
                    displayName = storedName;
                }

                videos.push({
                    id: item.name,
                    name: displayName,
                    url,
                    path,
                });
            }
        }

        // Get videos from subfolders
        for (const folder of result.prefixes) {
            const subfolderResult = await listAll(folder);
            for (const item of subfolderResult.items) {
                if (item.name.match(/\.(mp4|webm|mov|avi)$/i)) {
                    const url = await getDownloadURL(item);
                    const path = item.fullPath;

                    // Check for custom display name in Firestore
                    let displayName = item.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
                    const storedName = await getVideoDisplayName(path);
                    if (storedName) {
                        displayName = storedName;
                    }

                    videos.push({
                        id: `${folder.name}-${item.name}`,
                        name: displayName,
                        url,
                        path,
                    });
                }
            }
        }

        return videos;
    } catch (error) {
        console.error("Error listing videos:", error);
        return [];
    }
}

/**
 * Rename a video using Firestore
 */
export async function renameVideo(videoPath: string, newName: string): Promise<void> {
    console.log("renameVideo called with:", { videoPath, newName });
    try {
        // Create a safe document ID from the path
        const docId = videoPath.replace(/\//g, "_").replace(/\./g, "-");
        console.log("Writing to Firestore:", { docId, collection: "displayNames" });

        await setDoc(doc(db, "displayNames", docId), {
            path: videoPath,
            displayName: newName,
            type: "video",
            updatedAt: Date.now()
        });

        console.log("Firestore write successful!");
    } catch (error) {
        console.error("Firestore write failed:", error);
        throw error;
    }
}

/**
 * Get stored display name for a video from Firestore
 */
export async function getVideoDisplayName(videoPath: string): Promise<string | null> {
    const docId = videoPath.replace(/\//g, "_").replace(/\./g, "-");
    const docSnap = await getDoc(doc(db, "displayNames", docId));
    if (docSnap.exists()) {
        return docSnap.data().displayName;
    }
    return null;
}

/**
 * Rename a gallery using Firestore
 */
export async function renameGalleryFirestore(galleryId: string, newName: string): Promise<void> {
    const docId = `gallery_${galleryId}`;
    await setDoc(doc(db, "displayNames", docId), {
        galleryId,
        displayName: newName,
        type: "gallery",
        updatedAt: Date.now()
    });
}

/**
 * Get stored display name for a gallery from Firestore
 */
export async function getGalleryDisplayName(galleryId: string): Promise<string | null> {
    const docId = `gallery_${galleryId}`;
    const docSnap = await getDoc(doc(db, "displayNames", docId));
    if (docSnap.exists()) {
        return docSnap.data().displayName;
    }
    return null;
}

/**
 * Rename a gallery by moving all files to new folder
 */
export async function renameGallery(oldName: string, newName: string): Promise<void> {
    const oldFolderRef = ref(storage, `photos/${oldName}`);
    const newFolderName = newName.replace(/\s+/g, "_").toLowerCase();

    // List all files in old folder
    const result = await listAll(oldFolderRef);

    // Copy each file to new location
    for (const item of result.items) {
        // Download using getBytes (CORS-safe)
        const bytes = await getBytes(item);

        const newPath = `photos/${newFolderName}/${item.name}`;
        const newRef = ref(storage, newPath);
        await uploadBytes(newRef, bytes);

        // Delete old file
        await deleteObject(item);
    }
}
