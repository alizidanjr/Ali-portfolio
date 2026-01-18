import { BookingContent } from "@/components/booking/BookingContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Booking",
    description: "Book a professional photography or videography session with Ali Zidan. Choose your service, select a date, and let's create something together.",
};

export default function BookingPage() {
    return <BookingContent />;
}
