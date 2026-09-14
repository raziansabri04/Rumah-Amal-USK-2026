import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Rumah Amal Masjid Jamik Universitas Syiah Kuala",
  description:
    "Lembaga pengelola zakat, infaq, dan sedekah Masjid Jamik Universitas Syiah Kuala Banda Aceh.",
  keywords: ["Rumah Amal", "USK", "Masjid Jamik USK", "Zakat USK", "Infak USK", "Universitas Syiah Kuala"],
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col text-gray-800">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
