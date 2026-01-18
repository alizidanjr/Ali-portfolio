import { AboutContent } from "@/components/about/AboutContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about Ali Zidan - a visual storyteller, photographer, and videographer based in Cairo, Egypt.",
};

export default function AboutPage() {
    return <AboutContent />;
}
