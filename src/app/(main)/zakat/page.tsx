import ZakatClient from "./ZakatClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function ZakatPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500 font-semibold">Memuat formulir zakat...</div>}>
      <ZakatClient />
    </Suspense>
  );
}
