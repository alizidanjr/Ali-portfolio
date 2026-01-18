import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { format } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

const bookingSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    serviceType: z.string().min(1),
    date: z.string().transform((str) => new Date(str)),
    message: z.string().min(10),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = bookingSchema.parse(body);

        const formattedDate = format(validatedData.date, "PPP");
        const serviceTypeDisplay = {
            photography: "Photography",
            videography: "Videography",
            both: "Photography & Videography",
        }[validatedData.serviceType] || validatedData.serviceType;

        // Send notification email to the business owner
        const { data, error } = await resend.emails.send({
            from: "Booking <bookings@alizidanjr.site>",
            to: [process.env.BOOKING_NOTIFICATION_EMAIL || "alihassancut@gmail.com"],
            subject: `New Booking Request from ${validatedData.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
                        New Booking Request
                    </h1>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h2 style="margin-top: 0; color: #1e293b;">Client Details</h2>
                        <p><strong>Name:</strong> ${validatedData.name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
                    </div>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h2 style="margin-top: 0; color: #1e293b;">Booking Details</h2>
                        <p><strong>Service Type:</strong> ${serviceTypeDisplay}</p>
                        <p><strong>Preferred Date:</strong> ${formattedDate}</p>
                    </div>
                    
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h2 style="margin-top: 0; color: #1e293b;">Message</h2>
                        <p style="white-space: pre-wrap;">${validatedData.message}</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    
                    <p style="color: #64748b; font-size: 14px;">
                        Reply directly to this email to contact the client at ${validatedData.email}
                    </p>
                </div>
            `,
            replyTo: validatedData.email,
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json(
                { success: false, error: "Failed to send email" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Booking request sent successfully!",
            emailId: data?.id,
        });
    } catch (error) {
        console.error("Booking API error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: "Invalid form data", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
