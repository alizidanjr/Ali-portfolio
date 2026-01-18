import { Gallery } from "@/components/home/Gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Explore the photography portfolio of Ali Zidan - captured moments, portraits, and commercial photography.",
};

export default function GalleryPage() {
    return (
        <>
            <Gallery />
        </>
    );
}
