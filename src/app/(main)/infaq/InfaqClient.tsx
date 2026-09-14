"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { submitInfaq } from "@/actions/infaq";
import Image from "next/image";
import { infaqDictionary, InfaqLanguage } from "@/lib/i18n/infaq";
import { formatThousand, parseRawNumber } from "@/lib/formatNumber";
import { TipePembayar } from "@/types";

type KampanyeOption = {
  id: string;
  judul: string;
  judulAr?: string | null;
  judulEn?: string | null;
};

/* ── Inline field error component ───────────────────────────────── */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-red-600 font-semibold flex items-center gap-1">
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {message}
    </p>
  );
}

export default function InfaqClient({ programs }: { programs: KampanyeOption[] }) {
  const searchParams = useSearchParams();
  const kampanyeIdFromUrl = searchParams.get("kampanyeId");
  const programFromUrl = searchParams.get("program");

  const [lang, setLang] = useState<InfaqLanguage>("id");
  const [tipePembayar, setTipePembayar] = useState<TipePembayar>("masyarakat");
  const [selectedKampanyeId, setSelectedKampanyeId] = useState<string>("");
  const [jenisInfaq, setJenisInfaq] = useState<string>("Infak Umum / Sedekah Sukarela");
  const [jumlahInfaq, setJumlahInfaq] = useState<string>("");
  const [nama, setNama] = useState<string>("");
  const [isHambaAllah, setIsHambaAllah] = useState<boolean>(false);
  const [nip, setNip] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [alamat, setAlamat] = useState<string>("");
  const [noHp, setNoHp] = useState<string>("");
  const [bersediaDihubungi, setBersediaDihubungi] = useState<boolean>(false);
  const [pesan, setPesan] = useState<string>("");
  const [setujuTerms, setSetujuTerms] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("File...");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const readLang = () => {
      const saved = (localStorage.getItem("app_lang") ||
        localStorage.getItem("program_lang")) as InfaqLanguage;
      if (saved && ["id", "en", "ar"].includes(saved)) {
        setLang(saved);
      }
    };
    readLang();
    window.addEventListener("languageChange", readLang);
    return () => window.removeEventListener("languageChange", readLang);
  }, []);

  const getKampanyeTitle = (p: KampanyeOption) => {
    if (lang === "en" && p.judulEn) return p.judulEn;
    if (lang === "ar" && p.judulAr) return p.judulAr;
    return p.judul;
  };

  // Sync selected Kampanye from URL parameter if provided
  useEffect(() => {
    if (kampanyeIdFromUrl) {
      const found = programs.find((p) => p.id === kampanyeIdFromUrl);
      if (found) {
        setSelectedKampanyeId(found.id);
        setJenisInfaq(found.judul);
      }
    } else if (programFromUrl) {
      const found = programs.find(
        (p) => p.judul.toLowerCase() === programFromUrl.toLowerCase()
      );
      if (found) {
        setSelectedKampanyeId(found.id);
        setJenisInfaq(found.judul);
      } else {
        setJenisInfaq(programFromUrl);
      }
    }
  }, [kampanyeIdFromUrl, programFromUrl, programs]);

  const handleKampanyeChange = (value: string) => {
    setSelectedKampanyeId(value);
    if (!value) {
      setJenisInfaq("Infak Umum / Sedekah Sukarela");
    } else {
      const selected = programs.find((p) => p.id === value);
      if (selected) setJenisInfaq(selected.judul);
    }
  };

  const handleTipeSwitch = (tipe: TipePembayar) => {
    setTipePembayar(tipe);
    setErrorMsg("");
    setFieldErrors({});
    if (tipe === "muzakki usk") setIsHambaAllah(false);
  };

  /** Clear a specific field error when user interacts */
  const clearError = (field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    // ── Custom validation ──
    const errors: Record<string, string> = {};

    if (!jumlahInfaq.trim()) errors.jumlah_infaq = t.vJumlah;

    if (tipePembayar === "muzakki usk") {
      if (!nip.trim()) errors.nip = t.vNip;
    } else {
      if (!nama.trim()) errors.nama = t.vNama;
      if (!email.trim()) {
        errors.email = t.vEmail;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = t.vEmailInvalid;
      }
    }

    // Bukti upload
    const buktiInput = e.currentTarget.querySelector<HTMLInputElement>('input[name="bukti_pembayaran"]');
    if (!buktiInput?.files?.length) errors.bukti = t.uploadRequired;

    // Terms
    if (!setujuTerms) errors.terms = t.vTerms;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error
      const firstKey = Object.keys(errors)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await submitInfaq(formData);
    } catch (err: any) {
      setErrorMsg(err.message || t.errorDefault);
      setSubmitting(false);
    }
  };

  const handleHambaAllahChange = (checked: boolean) => {
    setIsHambaAllah(checked);
    setNama(checked ? "Hamba Allah" : "");
  };

  const t = infaqDictionary[lang] || infaqDictionary.id;
  const isRtl = lang === "ar";
  const selectedKampanyeObj = programs.find((p) => p.id === selectedKampanyeId);
  const isPalestina = (
    jenisInfaq.toLowerCase().includes("palestina") ||
    Boolean(selectedKampanyeObj?.judul?.toLowerCase().includes("palestina"))
  );
  const qrisImageSrc = isPalestina ? "/Qris/qris-bsi-palestina.jpeg" : "/Qris/qris-bsi-ra.png";
  const qrisAltText = isPalestina
    ? "QRIS Infaq Peduli Palestina Rumah Amal USK"
    : "QRIS BSI Rumah Amal Masjid Jamik USK";

  /** Helper: border class for field with error */
  const errBorder = (field: string) =>
    fieldErrors[field] ? "border-red-400 ring-1 ring-red-300" : "border-gray-300";

  return (
    <main
      className={`flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-[1340px] mx-auto w-full font-sans ${isRtl ? "text-right" : ""}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Selector Tab Tipe Pembayar */}
      <div className="text-center mb-8">
        <div className="inline-flex rounded-xl p-1 bg-gray-200/80 shadow-inner">
          <button
            type="button"
            onClick={() => handleTipeSwitch("muzakki usk")}
            className={`text-xs sm:text-sm font-extrabold px-8 py-2.5 rounded-lg transition-all cursor-pointer ${tipePembayar === "muzakki usk"
              ? "bg-[#FFBB0C] text-[#000] shadow-sm"
              : "text-gray-600 hover:text-[#000]"
              }`}
          >
            {t.tipeDosen}
          </button>
          <button
            type="button"
            onClick={() => handleTipeSwitch("masyarakat")}
            className={`text-xs sm:text-sm font-extrabold px-8 py-2.5 rounded-lg transition-all cursor-pointer ${tipePembayar === "masyarakat"
              ? "bg-[#FFBB0C] text-[#000] shadow-sm"
              : "text-gray-600 hover:text-[#000]"
              }`}
          >
            {t.tipeMasyarakat}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigasi */}
        <Sidebar />

        {/* Form Pembayaran Infaq */}
        <form onSubmit={handleFormSubmit} noValidate className="contents">
          <input type="hidden" name="tipe_pembayar" value={tipePembayar} />
          <input type="hidden" name="jenis_infaq" value={jenisInfaq} />
          <input type="hidden" name="kampanye_id" value={selectedKampanyeId} />

          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl shadow-md border border-gray-100 space-y-4">
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-start gap-2">
                <span className="shrink-0 text-base">⚠️</span>
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className={`text-lg font-black text-[#000] ${isRtl ? "font-serif" : ""}`}>
                {t.formTitle}
              </h3>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-[#000] uppercase">
                {tipePembayar === "muzakki usk" ? t.tipeDosen : t.tipeMasyarakat}
              </span>
            </div>

            {/* Kategori Infaq / Kampanye Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t.kategoriLabel} <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedKampanyeId ? selectedKampanyeId : jenisInfaq}
                onChange={(e) => {
                  const val = e.target.value;
                  if (programs.some((p) => p.id === val)) {
                    handleKampanyeChange(val);
                  } else {
                    setSelectedKampanyeId("");
                    setJenisInfaq(val);
                  }
                }}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#005621] bg-white font-medium"
              >
                <optgroup label={t.groupBebas}>
                  <option value="Infak Umum / Sedekah Sukarela">{t.infakUmum}</option>
                  <option value="Komunitas Infaq Rutin">{t.komunitas}</option>
                </optgroup>
                {programs.length > 0 && (
                  <optgroup label={t.groupTerikat}>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {getKampanyeTitle(p)}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              {/* Indicator badge */}
              {selectedKampanyeObj ? (
                <div className="mt-2 text-xs p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-center gap-1.5 font-medium">
                  <span>🔗</span>
                  <span>
                    {t.badgeTerikat} <strong>{getKampanyeTitle(selectedKampanyeObj)}</strong>
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-xs p-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl flex items-center gap-1.5 font-medium">
                  <span>🔓</span>
                  <span>{t.badgeBebas}</span>
                </div>
              )}
            </div>

            {/* Jumlah Infaq */}
            <div data-field="jumlah_infaq">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t.jumlahLabel} <span className="text-red-500">*</span>
              </label>
              <div className={`flex rounded-xl shadow-2xs overflow-hidden border ${errBorder("jumlah_infaq")} focus-within:border-[#005621]`}>
                <span className="inline-flex items-center px-4 bg-gray-100 text-gray-600 text-xs font-bold border-r border-gray-300">
                  Rp.
                </span>
                <input
                  type="text"
                  value={jumlahInfaq}
                  onChange={(e) => { setJumlahInfaq(formatThousand(e.target.value)); clearError("jumlah_infaq"); }}
                  placeholder={t.jumlahPlaceholder}
                  className="flex-1 block w-full px-3.5 py-2.5 text-sm focus:outline-none bg-white font-medium"
                />
                <input type="hidden" name="jumlah_infaq" value={parseRawNumber(jumlahInfaq)} />
              </div>
              <FieldError message={fieldErrors.jumlah_infaq} />
            </div>

            {/* Muzakki: NIP — Masyarakat: Nama/Email/Alamat */}
            {tipePembayar === "muzakki usk" ? (
              <div data-field="nip">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {t.nipLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nip"
                  value={nip}
                  onChange={(e) => { setNip(e.target.value); clearError("nip"); }}
                  placeholder={t.nipPlaceholder}
                  className={`w-full border ${errBorder("nip")} rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#005621] bg-white font-mono`}
                />
                <FieldError message={fieldErrors.nip} />
              </div>
            ) : (
              <>
                {/* Nama Lengkap */}
                <div data-field="nama">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {t.namaLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={nama}
                    onChange={(e) => { setNama(e.target.value); clearError("nama"); }}
                    readOnly={isHambaAllah}
                    placeholder={t.namaPlaceholder}
                    className={`w-full border ${errBorder("nama")} rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#005621] 
                      ${isHambaAllah ? "bg-gray-100 text-gray-500" : "bg-white"
                      }`}
                  />
                  <FieldError message={fieldErrors.nama} />
                </div>

                {/* Checkbox Hamba Allah */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="anon-check-infaq"
                    name="is_hamba_allah"
                    value="1"
                    checked={isHambaAllah}
                    onChange={(e) => { handleHambaAllahChange(e.target.checked); clearError("nama"); }}
                    className="w-4 h-4 text-[#000] rounded focus:ring-[#005621] cursor-pointer"
                  />
                  <label
                    htmlFor="anon-check-infaq"
                    className="text-xs text-gray-600 font-semibold cursor-pointer"
                  >
                    {t.hambaAllahLabel}
                  </label>
                </div>

                {/* Email */}
                <div data-field="email">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {t.emailLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                    placeholder={t.emailPlaceholder}
                    className={`w-full border ${errBorder("email")} rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#005621] bg-white`}
                  />
                  <FieldError message={fieldErrors.email} />
                </div>

                {/* Alamat */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {t.alamatLabel}
                  </label>
                  <input
                    type="text"
                    name="alamat"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder={t.alamatPlaceholder}
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#005621] bg-white"
                  />
                </div>
              </>
            )}

            {/* No. Telepon */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t.noHpLabel}
              </label>
              <input
                type="text"
                name="no_hp"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder={t.noHpPlaceholder}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#005621] bg-white"
              />
            </div>

            {/* Checkbox Hubungi Kembali */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="agree-contact-infaq"
                name="bersedia_dihubungi"
                value="1"
                checked={bersediaDihubungi}
                onChange={(e) => setBersediaDihubungi(e.target.checked)}
                className="w-4 h-4 text-[#000] rounded focus:ring-[#005621] mt-0.5 cursor-pointer"
              />
              <label
                htmlFor="agree-contact-infaq"
                className="text-xs text-gray-600 leading-snug cursor-pointer"
              >
                {t.bersediaDihubungiLabel}
              </label>
            </div>

            {/* Pesan / Doa */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t.pesanLabel}
              </label>
              <textarea
                name="pesan"
                rows={3}
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder={t.pesanPlaceholder}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#005621] bg-white"
              />
            </div>
          </div>

          {/* Kolom Kanan: Metode Pembayaran */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-2xl shadow-md border border-gray-100 space-y-5">
            <h3 className={`text-lg font-black text-[#000] border-b border-gray-100 pb-3 ${isRtl ? "font-serif" : ""}`}>
              {t.paymentMethodTitle}
            </h3>

            {/* Card Scan QRIS */}
            <div className="text-center py-5 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-48 h-48 mx-auto bg-white p-3 border border-gray-100 rounded-xl shadow-xs flex items-center justify-center">
                <Image
                  src={qrisImageSrc}
                  alt={qrisAltText}
                  width={97.2}
                  height={112.2}
                  priority
                  className="h-48 sm:h-52 w-auto object-contain transition-all"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
                {isPalestina ? t.qrisNotePalestina : t.qrisNote}
              </p>
            </div>

            {/* Upload Bukti Pembayaran */}
            <div data-field="bukti">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t.uploadLabel} <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center justify-between rounded-xl p-2 bg-gray-50/80 border ${errBorder("bukti")}`}>
                <input
                  type="file"
                  id="bukti-infaq"
                  name="bukti_pembayaran"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    setFileName(e.target.files?.[0]?.name || t.chooseFileBtn);
                    if (e.target.files?.length) clearError("bukti");
                  }}
                />
                <span className="text-xs text-gray-500 truncate px-2 max-w-[200px]">
                  {fileName}
                </span>
                <button
                  type="button"
                  onClick={() => document.getElementById("bukti-infaq")?.click()}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  {t.chooseFileBtn}
                </button>
              </div>
              <FieldError message={fieldErrors.bukti} />
            </div>

            {/* Setuju Syarat & Ketentuan */}
            <div data-field="terms">
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms-infaq"
                  name="setuju_terms"
                  value="1"
                  checked={setujuTerms}
                  onChange={(e) => { setSetujuTerms(e.target.checked); clearError("terms"); }}
                  className="w-4 h-4 text-[#000] rounded focus:ring-[#005621] mt-0.5 cursor-pointer"
                />
                <label
                  htmlFor="terms-infaq"
                  className="text-xs text-gray-600 leading-snug cursor-pointer"
                >
                  {t.termsLabel}
                </label>
              </div>
              <FieldError message={fieldErrors.terms} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#FFBB0C] hover:bg-[#e8b500] text-[#000] font-black py-3.5 rounded-xl text-sm shadow-md transition-all duration-200 hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              {submitting ? t.submittingBtn : t.submitBtn}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
