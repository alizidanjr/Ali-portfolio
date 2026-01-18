import { NextRequest, NextResponse } from "next/server";

// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "alihassancut@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Alih@ss@n03$";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Generate a simple session token
            const sessionToken = Buffer.from(`${email}:${Date.now()}`).toString("base64");

            const response = NextResponse.json(
                { success: true, message: "Login successful" },
                { status: 200 }
            );

            // Set HTTP-only cookie for session
            response.cookies.set("admin_session", sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24, // 24 hours
                path: "/",
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: "Invalid credentials" },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
