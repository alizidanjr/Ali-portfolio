import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();

        // Resend Inbound Webhook payload contains data about the received email
        // Format: { from, to, subject, text, html, cc, bcc, ... }
        const { from, to, subject, text, html } = payload;

        // 1. Store in Firestore
        await addDoc(collection(db, "received_emails"), {
            from,
            to,
            subject,
            text: text || "",
            html: html || "",
            receivedAt: serverTimestamp(),
            status: "unread",
            payload: payload // Keep raw payload for debugging
        });

        // 2. Forward to target email (alihassancut@gmail.com)
        // Note: Using a professional 'from' address from the verified domain
        await resend.emails.send({
            from: "Inbox <inbox@alizidanjr.site>",
            to: ["alihassancut@gmail.com"],
            subject: `FWD: ${subject || "No Subject"} (from ${from})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background: #f9fafb; border-radius: 8px;">
                    <div style="margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                        <p><strong>From:</strong> ${from}</p>
                        <p><strong>To:</strong> ${to}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 4px; border: 1px solid #e5e7eb;">
                        ${html || `<pre style="white-space: pre-wrap;">${text}</pre>`}
                    </div>
                    <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
                        This email was received at alizidanjr.site and automatically forwarded.
                    </p>
                </div>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Inbound webhook error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
