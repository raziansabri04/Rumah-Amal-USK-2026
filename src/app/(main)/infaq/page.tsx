import { getActiveKampanye } from "@/actions/kampanye";
import InfaqClient from "./InfaqClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function InfaqPage() {
  const kampanyes = await getActiveKampanye();

  const programs = kampanyes.map((k) => ({
    id: k.id,
    judul: k.judul,
    judulEn: k.judulEn,
    judulAr: k.judulAr,
  }));

  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500 font-semibold">Memuat formulir infaq...</div>}>
      <InfaqClient programs={programs} />
    </Suspense>
  );
}
