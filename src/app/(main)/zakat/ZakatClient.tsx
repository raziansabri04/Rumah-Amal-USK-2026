"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { submitZakat } from "@/actions/zakat";
import Image from "next/image";
import { zakatDictionary, ZakatLanguage } from "@/lib/i18n/zakat";
import { formatThousand, parseRawNumber } from "@/lib/formatNumber";
import { TipePembayar } from "@/types";

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

export default function ZakatClient() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<ZakatLanguage>("id");
  const [tipePembayar, setTipePembayar] = useState<TipePembayar>("masyarakat");
  const [jenisZakat, setJenisZakat] = useState<string>("");
  const [sumberDana, setSumberDana] = useState<string>("");
  const [jenisPerusahaan, setJenisPerusahaan] = useState<string>("");
  const [jumlahZakat, setJumlahZakat] = useState<string>("");
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
        localStorage.getItem("zakat_lang") ||
        localStorage.getItem("program_lang")) as ZakatLanguage;
      if (saved && ["id", "en", "ar"].includes(saved)) {
        setLang(saved);
      }
    };
    readLang();
    window.addEventListener("languageChange", readLang);
    return () => window.removeEventListener("languageChange", readLang);
  }, []);

  const t = zakatDictionary[lang] || zakatDictionary.id;
  const isRtl = lang === "ar";

  useEffect(() => {
    const jZakat = searchParams.get("jenis_zakat");
    const jlZakat = searchParams.get("jumlah_zakat");
    if (jZakat) setJenisZakat(jZakat);
    if (jlZakat) setJumlahZakat(formatThousand(jlZakat));
  }, [searchParams]);

  const handleTipeSwitch = (tipe: TipePembayar) => {
    setTipePembayar(tipe);
    setErrorMsg("");
    setFieldErrors({});
    if (tipe === "muzakki usk") {
      setIsHambaAllah(false);
    }
  };

  const handleHambaAllahChange = (checked: boolean) => {
    setIsHambaAllah(checked);
    if (checked) {
      setNama("Hamba Allah");
    } else {
      setNama("");
    }
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

    if (!jenisZakat) errors.jenis_zakat = t.vSelectZakat;
    if (!jumlahZakat.trim()) errors.jumlah_zakat = t.vJumlah;

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
      await submitZakat(formData);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses zakat.");
      setSubmitting(false);
    }
  };

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

        {/* Form Pembayaran Zakat */}
        <form onSubmit={handleFormSubmit} noValidate className="contents">
          <input type="hidden" name="tipe_pembayar" value={tipePembayar} />

          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl shadow-md border border-gray-100 space-y-4">

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-start gap-2">
                <span className="shrink-0 text-base">⚠️</span>
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-[#000]">{t.formTitle}</h3>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-[#000] uppercase">
                {tipePembayar === "muzakki usk" ? t.tipeDosen : t.tipeMasyarakat}
              </span>
            </div>

            {/* Jenis Zakat */}
            <div data-field="jenis_zakat">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.jenisZakatLabel} <span className="text-red-500">*</span></label>
              <select
                name="jenis_zakat"
                value={jenisZakat}
                onChange={(e) => { setJenisZakat(e.target.value); clearError("jenis_zakat"); }}
                className={`w-full border ${errBorder("jenis_zakat")} rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330] focus:ring-1 focus:ring-[#0b6330] transition-all bg-white`}
              >
                <option value="">{t.selectJenisZakat}</option>
                <option value="maal">{t.maal}</option>
                <option value="emas">{t.emas}</option>
                <option value="profesi">{t.profesi}</option>
                <option value="perniagaan">{t.perniagaan}</option>
                <option value="perusahaan">{t.perusahaan}</option>
              </select>
              <FieldError message={fieldErrors.jenis_zakat} />
            </div>

            {/* Sumber Dana (Tampil jika Jenis Zakat = Profesi) */}
            {jenisZakat === "profesi" && (
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/70">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.sumberDanaLabel}</label>
                <select
                  name="sumber_dana"
                  value={sumberDana}
                  onChange={(e) => setSumberDana(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330] bg-white"
                >
                  <option value="">{t.selectSumberDana}</option>
                  <option value="remunerasi">{t.remunerasi}</option>
                  <option value="serdos">{t.serdos}</option>
                  <option value="penghasilan_bulanan">{t.penghasilan_bulanan}</option>
                  <option value="sertifikasi_profesor">{t.sertifikasi_profesor}</option>
                  <option value="seluruh_dana">{t.seluruh_dana}</option>
                </select>
              </div>
            )}

            {/* Jenis Perusahaan (Tampil jika Jenis Zakat = Perusahaan) */}
            {jenisZakat === "perusahaan" && (
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/70">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.jenisPerusahaanLabel}</label>
                <select
                  name="jenis_perusahaan"
                  value={jenisPerusahaan}
                  onChange={(e) => setJenisPerusahaan(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330] bg-white"
                >
                  <option value="">{t.selectJenisPerusahaan}</option>
                  <option value="dagang_industri">{t.dagang_industri}</option>
                  <option value="jasa">{t.jasa}</option>
                </select>
              </div>
            )}

            {/* Jumlah Zakat */}
            <div data-field="jumlah_zakat">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.jumlahZakatLabel} <span className="text-red-500">*</span></label>
              <div className={`flex rounded-xl shadow-2xs overflow-hidden border ${errBorder("jumlah_zakat")} focus-within:border-[#0b6330] focus-within:ring-1 focus-within:ring-[#0b6330]`}>
                <span className="inline-flex items-center px-4 bg-gray-100 text-gray-600 text-xs font-bold border-r border-gray-300">
                  Rp.
                </span>
                <input
                  type="text"
                  value={jumlahZakat}
                  onChange={(e) => { setJumlahZakat(formatThousand(e.target.value)); clearError("jumlah_zakat"); }}
                  placeholder={t.jumlahZakatPlaceholder}
                  className="flex-1 block w-full px-3.5 py-2.5 text-sm focus:outline-none bg-white font-medium"
                />
                <input type="hidden" name="jumlah_zakat" value={parseRawNumber(jumlahZakat)} />
              </div>
              <FieldError message={fieldErrors.jumlah_zakat} />
            </div>

            {/* Muzakki: cukup NIP — masyarakat: nama/email/alamat */}
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
                  className={`w-full border ${errBorder("nip")} rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330] bg-white font-mono`}
                />
                <FieldError message={fieldErrors.nip} />
              </div>
            ) : (
              <>
                {/* Nama Lengkap */}
                <div data-field="nama">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.namaLabel} <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="nama"
                    value={nama}
                    onChange={(e) => { setNama(e.target.value); clearError("nama"); }}
                    readOnly={isHambaAllah}
                    placeholder={t.namaPlaceholder}
                    className={`w-full border ${errBorder("nama")} rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330] transition-all ${isHambaAllah ? "bg-gray-100 text-gray-500" : "bg-white"}`}
                  />
                  <FieldError message={fieldErrors.nama} />
                </div>

                {/* Checkbox Hamba Allah */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="anon-check-zakat"
                    name="is_hamba_allah"
                    value="1"
                    checked={isHambaAllah}
                    onChange={(e) => { handleHambaAllahChange(e.target.checked); clearError("nama"); }}
                    className="w-4 h-4 text-[#000] rounded focus:ring-[#0b6330] cursor-pointer"
                  />
                  <label htmlFor="anon-check-zakat" className="text-xs text-gray-600 font-semibold cursor-pointer">
                    {t.hambaAllahLabel}
                  </label>
                </div>

                {/* Email */}
                <div data-field="email">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.emailLabel} <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                    placeholder={t.emailPlaceholder}
                    className={`w-full border ${errBorder("email")} rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330] bg-white`}
                  />
                  <FieldError message={fieldErrors.email} />
                </div>

                {/* Alamat */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.alamatLabel}</label>
                  <input
                    type="text"
                    name="alamat"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder={t.alamatPlaceholder}
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330] bg-white"
                  />
                </div>
              </>
            )}

            {/* No. Telepon */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.noHpLabel}</label>
              <input
                type="text"
                name="no_hp"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder={t.noHpPlaceholder}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330] bg-white"
              />
            </div>

            {/* Checkbox Hubungi Kembali */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="agree-contact-zakat"
                name="bersedia_dihubungi"
                value="1"
                checked={bersediaDihubungi}
                onChange={(e) => setBersediaDihubungi(e.target.checked)}
                className="w-4 h-4 text-[#000] rounded focus:ring-[#0b6330] mt-0.5 cursor-pointer"
              />
              <label htmlFor="agree-contact-zakat" className="text-xs text-gray-600 leading-snug cursor-pointer">
                {t.bersediaDihubungiLabel}
              </label>
            </div>

            {/* Pesan */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.pesanLabel}</label>
              <textarea
                name="pesan"
                rows={3}
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder={t.pesanPlaceholder}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330] bg-white"
              />
            </div>

          </div>

          {/* Kolom Kanan: Metode Pembayaran */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-2xl shadow-md border border-gray-100 space-y-5">
            <h3 className="text-lg font-black text-[#000] border-b border-gray-100 pb-3">
              {t.paymentMethodTitle}
            </h3>

            {/* Card Scan QRIS */}
            <div className="text-center py-5 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-48 h-48 mx-auto bg-white p-3 border border-gray-100 rounded-xl shadow-xs flex items-center justify-center">
                <Image
                  src="/Qris/qris-bsi-ra.png"
                  alt="QRIS BSI Rumah Amal Masjid Jamik USK"
                  width={97.2}
                  height={112.2}
                  priority
                  className={`h-48 sm:h-52 w-auto object-contain transition-all`}
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-3">
                {t.qrisNote}
              </p>
            </div>

            {/* Upload Bukti Pembayaran */}
            <div data-field="bukti">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.uploadLabel} <span className="text-red-500">*</span></label>
              <div className={`flex items-center justify-between rounded-xl p-2 bg-gray-50/80 border ${errBorder("bukti")}`}>
                <input
                  type="file"
                  id="bukti-zakat"
                  name="bukti_pembayaran"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    setFileName(e.target.files?.[0]?.name || t.chooseFileBtn);
                    if (e.target.files?.length) clearError("bukti");
                  }}
                />
                <span className="text-xs text-gray-500 truncate px-2 max-w-[200px]">{fileName}</span>
                <button
                  type="button"
                  onClick={() => document.getElementById("bukti-zakat")?.click()}
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
                  id="terms-zakat"
                  name="setuju_terms"
                  value="1"
                  checked={setujuTerms}
                  onChange={(e) => { setSetujuTerms(e.target.checked); clearError("terms"); }}
                  className="w-4 h-4 text-[#000] rounded focus:ring-[#0b6330] mt-0.5 cursor-pointer"
                />
                <label htmlFor="terms-zakat" className="text-xs text-gray-600 leading-snug cursor-pointer">
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
