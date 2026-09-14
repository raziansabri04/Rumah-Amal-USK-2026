import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Admin - Rumah Amal USK",
    description: "Panel admin Rumah Amal Masjid Jamik USK",
};

export default function AdminAuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}