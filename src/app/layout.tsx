import type { Metadata } from "next";
import { Poppins, Montserrat, Amiri } from "next/font/google";
import "@/app/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "Rumah Amal Masjid Jamik Universitas Syiah Kuala",
  description:
    "Lembaga pengelola zakat, infaq, dan sedekah Masjid Jamik Universitas Syiah Kuala Banda Aceh.",
  keywords: ["Rumah Amal", "USK", "Masjid Jamik USK", "Zakat USK", "Infak USK", "Universitas Syiah Kuala"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${montserrat.variable} ${amiri.variable} font-sans antialiased`}>
      <body className="min-h-screen bg-gray-50/50 text-gray-800">
        {children}
      </body>
    </html>
  );
}
