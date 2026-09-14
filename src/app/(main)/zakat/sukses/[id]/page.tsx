"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

const dict = {
  id: {
    title: "Alhamdulillah, Pembayaran Zakat Berhasil Terkirim!",
    desc: "Terima kasih telah menunaikan zakat melalui Rumah Amal Masjid Jamik USK. Data transaksi Anda telah kami catat dengan Kode Transaksi:",
    note: "Tim kami akan memverifikasi pembayaran Anda. Anda dapat mengecek status pembayaran sewaktu-waktu pada menu Cek Riwayat.",
    btnHome: "Kembali ke Beranda",
    btnRiwayat: "Cek Riwayat Pembayaran",
  },
  en: {
    title: "Alhamdulillah, Zakat Payment Successfully Sent!",
    desc: "Thank you for fulfilling your zakat through Rumah Amal Masjid Jamik USK. Your transaction code is:",
    note: "Our team will verify your payment. You can check your payment status anytime under the Check History menu.",
    btnHome: "Back to Home",
    btnRiwayat: "Check Payment History",
  },
  ar: {
    title: "الحمد لله، تم إرسال دفع الزكاة بنجاح!",
    desc: "شكراً لأداء زكاتك عبر Rumah Amal Masjid Jamik USK. تم تسجيل رمز المعاملة الخاص بك:",
    note: "سيتحقق فريقنا من دفعك. يمكنك التحقق من حالة الدفع في أي وقت من قائمة سجل الدفع.",
    btnHome: "العودة إلى الرئيسية",
    btnRiwayat: "سجل الدفع",
  },
};

export default function ZakatSuksesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [lang, setLang] = useState<"id" | "en" | "ar">("id");

  useEffect(() => {
    const readLang = () => {
      const saved = (localStorage.getItem("language") ||
        localStorage.getItem("app_lang") ||
        "id") as "id" | "en" | "ar";
      if (["id", "en", "ar"].includes(saved)) {
        setLang(saved);
      }
    };
    readLang();
    window.addEventListener("languageChange", readLang);
    return () => window.removeEventListener("languageChange", readLang);
  }, []);

  const t = dict[lang] || dict.id;
  const isAr = lang === "ar";

  return (
    <main
      className={`flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-[1340px] mx-auto w-full ${isAr ? "text-right" : ""}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Sidebar />

        <div className="lg:col-span-9 bg-white p-8 sm:p-10 rounded-2xl shadow-md border border-gray-100 text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-[#0b6330]">
            <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-black text-[#0b6330]">{t.title}</h2>

          <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            {t.desc}
          </p>

          <div className="inline-block bg-gray-100 font-mono font-bold text-base px-6 py-2.5 rounded-xl border border-gray-200 text-gray-800 tracking-wider">
            {id}
          </div>

          <p className="text-xs text-gray-500">
            {t.note}
          </p>

          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="bg-[#0b6330] hover:bg-[#062015] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-sm"
            >
              {t.btnHome}
            </Link>
            <Link
              href="/riwayat"
              className="bg-[#ffc800] hover:bg-[#e8b500] text-[#0b6330] font-extrabold px-6 py-3 rounded-xl text-sm transition-all shadow-sm"
            >
              {t.btnRiwayat}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
