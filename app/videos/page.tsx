import { Videos } from "@/components/home/Videos";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Videos",
    description: "Watch cinematic video work by Ali Zidan - professional videography, editing, and direction.",
};

export default function VideosPage() {
    return (
        <>
            <Videos />
        </>
    );
}
