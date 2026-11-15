import type { Metadata } from "next";
import CaraInstallContent from "@/components/CaraInstallContent";

export const metadata: Metadata = {
  title: "Cara Install Aplikasi | Rumah Amal USK",
  description:
    "Panduan memasang aplikasi Rumah Amal Masjid Jamik USK di Android, iPhone/iPad, dan komputer.",
};

export default function CaraInstallPage() {
  return <CaraInstallContent />;
}