import { BTSGallery } from "@/components/home/BTSGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Behind The Scenes",
    description: "Peek behind the lens of Ali Zidan. See the process, the gear, and the team behind the cinematic work.",
};

export default function BTSPage() {
    return (
        <main className="bg-black">
            <BTSGallery />
        </main>
    );
}
