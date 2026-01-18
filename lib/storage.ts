import { storage, db } from "./firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";

export interface PortfolioImage {
    id: string;
    src: string;
    type: "photo";
    span: string;
    category?: string;
}

export interface PortfolioVideo {
    id: string;
    title: string;
    thumbnail: string;
    videoUrl?: string;
    duration: string;
}

// Grid span patterns for gallery layout
const spanPatterns = [
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
];

/**
 * Fetch all images from the "photos" folder in Firebase Storage
 * Searches recursively through subfolders
 */
export async function getPortfolioImages(): Promise<PortfolioImage[]> {
    try {
        const folderRef = ref(storage, "photos");
        const result = await listAll(folderRef);

        const allImages: PortfolioImage[] = [];
        let imageIndex = 0;

        // Get images from root folder
        for (const item of result.items) {
            if (item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                const url = await getDownloadURL(item);
                allImages.push({
                    id: item.name,
                    src: url,
                    type: "photo",
                    span: spanPatterns[imageIndex % spanPatterns.length],
                    category: "General",
                });
                imageIndex++;
            }
        }

        // Get images from subfolders
        for (const folder of result.prefixes) {
            const subfolderResult = await listAll(folder);
            for (const item of subfolderResult.items) {
                if (item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    const url = await getDownloadURL(item);
                    allImages.push({
                        id: `${folder.name}-${item.name}`,
                        src: url,
                        type: "photo",
                        span: spanPatterns[imageIndex % spanPatterns.length],
                        category: folder.name.charAt(0).toUpperCase() + folder.name.slice(1),
                    });
                    imageIndex++;
                }
            }
        }

        return allImages;
    } catch (error) {
        console.error("Error fetching portfolio images:", error);
        return [];
    }
}

/**
 * Get display name from Firestore
 */
async function getDisplayName(path: string): Promise<string | null> {
    try {
        const docId = path.replace(/\//g, "_").replace(/\./g, "-");
        const docSnap = await getDoc(doc(db, "displayNames", docId));
        if (docSnap.exists()) {
            return docSnap.data().displayName;
        }
    } catch {
        // Firestore fetch failed
    }
    return null;
}

/**
 * Fetch all videos from the "videos" folder in Firebase Storage
 * Searches recursively through subfolders
 */
export async function getPortfolioVideos(): Promise<PortfolioVideo[]> {
    try {
        const folderRef = ref(storage, "videos");
        const result = await listAll(folderRef);

        const allVideos: PortfolioVideo[] = [];

        // Get videos from root folder
        for (const item of result.items) {
            if (item.name.match(/\.(mp4|webm|mov|avi)$/i)) {
                const url = await getDownloadURL(item);
                const path = item.fullPath;

                // Check for custom display name in Firestore
                let title = item.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
                const storedName = await getDisplayName(path);
                if (storedName) {
                    title = storedName;
                }

                allVideos.push({
                    id: item.name,
                    title,
                    thumbnail: url,
                    videoUrl: url,
                    duration: "0:00",
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
                    let title = item.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
                    const storedName = await getDisplayName(path);
                    if (storedName) {
                        title = storedName;
                    }

                    allVideos.push({
                        id: `${folder.name}-${item.name}`,
                        title,
                        thumbnail: url,
                        videoUrl: url,
                        duration: "0:00",
                    });
                }
            }
        }

        return allVideos;
    } catch (error) {
        console.error("Error fetching portfolio videos:", error);
        return [];
    }
}

/**
 * Fetch a single image URL by path
 */
export async function getImageUrl(path: string): Promise<string | null> {
    try {
        const imageRef = ref(storage, path);
        return await getDownloadURL(imageRef);
    } catch (error) {
        console.error("Error fetching image URL:", error);
        return null;
    }
}
