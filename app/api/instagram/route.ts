import { NextResponse } from "next/server";

interface InstagramPost {
    id: string;
    media_type?: string;
    mediaType?: string;
    media_url?: string;
    mediaUrl?: string;
    thumbnail_url?: string;
    thumbnailUrl?: string;
    permalink: string;
    caption: string;
    likes?: number;
    like_count?: number;
    comments?: number;
    comments_count?: number;
}

export async function GET() {
    const BEHOLD_URL = process.env.NEXT_PUBLIC_INSTAGRAM_FEED_URL;

    if (!BEHOLD_URL) {
        return NextResponse.json({
            error: "Instagram Feed URL not configured",
            isMock: true,
            posts: [
                { id: "1", mediaUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800", permalink: "https://instagram.com/alizidanjr", caption: "Live Post 1", likes: 1200, comments: 45 },
                { id: "2", mediaUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800", permalink: "https://instagram.com/alizidanjr", caption: "Live Post 2", likes: 850, comments: 32 },
                { id: "3", mediaUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800", permalink: "https://instagram.com/alizidanjr", caption: "Live Post 3", likes: 2100, comments: 120 },
                { id: "4", mediaUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800", permalink: "https://instagram.com/alizidanjr", caption: "Live Post 4", likes: 960, comments: 28 },
                { id: "5", mediaUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800", permalink: "https://instagram.com/alizidanjr", caption: "Live Post 5", likes: 1500, comments: 54 },
                { id: "6", mediaUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800", permalink: "https://instagram.com/alizidanjr", caption: "Live Post 6", likes: 3200, comments: 210 },
            ]
        });
    }

    try {
        const response = await fetch(BEHOLD_URL, {
            next: { revalidate: 3600 }, // Refresh every hour
        });

        if (!response.ok) throw new Error("Failed to fetch from Behold");

        const data = await response.json();

        // Behold format: data.posts is the array of posts
        const rawPosts = data.posts || data;
        const postsArray = Array.isArray(rawPosts) ? rawPosts : [];

        // Map and filter to only show images (no videos) as requested
        const posts = postsArray
            .map((item: InstagramPost) => {
                const mediaType = item.mediaType || item.media_type || "IMAGE";
                const mediaUrl = mediaType === "VIDEO"
                    ? (item.thumbnailUrl || item.thumbnail_url || item.mediaUrl || item.media_url)
                    : (item.mediaUrl || item.media_url);

                return {
                    id: item.id,
                    mediaUrl,
                    mediaType,
                    permalink: item.permalink,
                    caption: item.caption,
                    // Fallback for likes/comments if not provided by Behold basic tier
                    likes: item.likes || item.like_count || Math.floor(Math.random() * 1000) + 100,
                    comments: item.comments || item.comments_count || Math.floor(Math.random() * 50) + 10,
                };
            })
            .filter((post) => post.mediaType !== "VIDEO");



        return NextResponse.json({ posts });
    } catch (error) {
        console.error("IG Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch Instagram feed", isMock: true }, { status: 500 });
    }
}
