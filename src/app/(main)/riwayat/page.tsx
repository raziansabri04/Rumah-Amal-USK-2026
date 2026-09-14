'use client';

import { useEffect, useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import { requestRiwayatOtp, verifyRiwayatOtpAndFetch, cariRiwayatByEmail } from '@/actions/riwayat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  faSearch,
  faUserCheck,
  faCoins,
  faHandHoldingHeart,
  faFileInvoice,
  faCalendarAlt,
  faDownload,
  faChevronDown,
  faChevronUp,
  faSpinner,
  faIdCard,
  faEnvelope,
  faShieldHalved,
  faRotateRight,
  faArrowLeft,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { riwayatDictionary, RiwayatLanguage } from '@/lib/i18n/riwayat';

type RiwayatZakatItem = {
  id: string;
  jenis_zakat: string;
  jumlah_zakat: number;
  sumber_dana?: string | null;
  status: 'pending' | 'lunas' | 'ditolak';
  created_at: Date;
};

type RekapZakatItem = {
  id: string;
  tahunRekap: string;
  fileUrl: string;
  createdAt: Date;
};

type RiwayatInfaqItem = {
  id: string;
  jenis_infaq: string;
  kampanye_judul?: string | null;
  jumlah_infaq: number;
  status: 'pending' | 'lunas' | 'ditolak';
  created_at: Date;
};

type RiwayatData = {
  // NIP mode
  nip?: string;
  unitKerja?: string | null;
  rekapZakat?: RekapZakatItem[];
  // Email mode
  email?: string;
  // Common
  nama: string | null;
  totalZakatLunas: number;
  totalInfaqLunas: number;
  riwayatZakat: RiwayatZakatItem[];
  riwayatInfaq: RiwayatInfaqItem[];
};

export default function RiwayatPage() {
  const [lang, setLang] = useState<RiwayatLanguage>('id');
  const [mode, setMode] = useState<'nip' | 'email'>('nip');

  // NIP OTP Flow States
  const [nipStep, setNipStep] = useState<'input_nip' | 'input_otp'>('input_nip');
  const [nipInput, setNipInput] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Email Flow States
  const [emailInput, setEmailInput] = useState('');

  // General States
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RiwayatData | null>(null);

  // Rekap Zakat section state
  const [showRekapSection, setShowRekapSection] = useState(false);
  const [selectedTahun, setSelectedTahun] = useState<string>('all');

  const otpInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const readLang = () => {
      const saved = (localStorage.getItem('language') ||
        localStorage.getItem('app_lang') ||
        'id') as RiwayatLanguage;
      if (['id', 'en', 'ar'].includes(saved)) {
        setLang(saved);
      }
    };
    readLang();
    window.addEventListener('languageChange', readLang);
    return () => window.removeEventListener('languageChange', readLang);
  }, []);

  // Timer cooldown decrement
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus OTP input when step changes
  useEffect(() => {
    if (nipStep === 'input_otp' && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [nipStep]);

  const t = riwayatDictionary[lang] || riwayatDictionary.id;
  const isAr = lang === 'ar';

  function handleModeChange(newMode: 'nip' | 'email') {
    setMode(newMode);
    setNipStep('input_nip');
    setNipInput('');
    setOtpInput('');
    setMaskedPhone('');
    setEmailInput('');
    setError(null);
    setData(null);
    setShowRekapSection(false);
    setSelectedTahun('all');
  }

  function handleReset() {
    setNipStep('input_nip');
    setOtpInput('');
    setError(null);
    setData(null);
    setShowRekapSection(false);
    setSelectedTahun('all');
  }

  // 1. Request OTP (NIP Mode - Step 1)
  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!nipInput.trim()) {
      setError(t.errNipEmpty);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await requestRiwayatOtp(nipInput.trim());
      setMaskedPhone(res.maskedPhone);
      setCooldown(res.cooldownSeconds || 60);
      setNipStep('input_otp');
      setOtpInput('');
    } catch (err: any) {
      setError(err.message || t.errSendOtpFailed);
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP (NIP Mode - Step 2)
  async function handleResendOtp() {
    if (cooldown > 0 || resendLoading) return;

    setResendLoading(true);
    setError(null);

    try {
      const res = await requestRiwayatOtp(nipInput.trim());
      setMaskedPhone(res.maskedPhone);
      setCooldown(res.cooldownSeconds || 60);
    } catch (err: any) {
      setError(err.message || t.errResendOtpFailed);
    } finally {
      setResendLoading(false);
    }
  }

  // 2. Verify OTP (NIP Mode - Step 2)
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setError(t.errOtpEmpty);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await verifyRiwayatOtpAndFetch(nipInput.trim(), otpInput.trim());
      if (
        !result.nama &&
        result.riwayatZakat.length === 0 &&
        result.riwayatInfaq.length === 0 &&
        result.rekapZakat.length === 0
      ) {
        setError(t.errNotFoundNip);
      } else {
        setData({ ...result });
        setShowRekapSection(false);
        setSelectedTahun('all');
      }
    } catch (err: any) {
      setError(err.message || t.errVerifyOtpFailed);
    } finally {
      setLoading(false);
    }
  }

  // 3. Search by Email (Email Mode)
  async function handleSearchEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) {
      setError(t.errEmailEmpty);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.trim())) {
      setError(t.errEmailInvalid);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await cariRiwayatByEmail(emailInput);
      if (
        !result.nama &&
        result.riwayatZakat.length === 0 &&
        result.riwayatInfaq.length === 0
      ) {
        setError(t.errNotFoundEmail);
      } else {
        setData({ ...result });
      }
    } catch (err: any) {
      setError(err.message || t.errFetchFailed);
    } finally {
      setLoading(false);
    }
  }

  function formatRupiah(angka: number) {
    const localeMap: Record<string, string> = { id: 'id-ID', en: 'en-US', ar: 'ar-SA' };
    return 'Rp ' + Number(angka || 0).toLocaleString(localeMap[lang] || 'id-ID');
  }

  function formatTanggal(date: Date) {
    try {
      const localeMap: Record<string, string> = { id: 'id-ID', en: 'en-US', ar: 'ar-SA' };
      return new Date(date).toLocaleDateString(localeMap[lang] || 'id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return String(date);
    }
  }

  function statusBadge(status: string) {
    const map: Record<string, string> = {
      lunas: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      ditolak: 'bg-red-100 text-red-700 border-red-200',
    };
    const labelMap: Record<string, string> = {
      lunas: t.statusLunas,
      pending: t.statusPending,
      ditolak: t.statusDitolak,
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${map[status] || 'bg-gray-100 text-gray-500'}`}>
        {labelMap[status] || status}
      </span>
    );
  }

  // List unique years from rekapZakat for filter (NIP mode only)
  const availableYears = Array.from(
    new Set(data?.rekapZakat?.map((item) => item.tahunRekap) || [])
  ).sort((a, b) => b.localeCompare(a));

  const filteredRekapZakat = data?.rekapZakat?.filter((item) => {
    if (selectedTahun === 'all') return true;
    return item.tahunRekap === selectedTahun;
  });

  const isDosen = mode === 'nip';

  return (
    <main
      className={`flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-[1340px] mx-auto w-full font-sans ${isAr ? 'text-right' : ''}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Sidebar />

        <div className="lg:col-span-9 space-y-6">
          {/* Card Pencarian / Verifikasi */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 transition-all">
            <h3 className="text-xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faSearch} className="text-[#0b6330] w-5 h-5" />
              {t.pageTitle}
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              {t.pageSubtitle}
            </p>

            {/* Mode Toggle */}
            <div className="inline-flex rounded-xl p-1 bg-gray-100/80 shadow-inner gap-1 mb-5 flex-wrap">
              <button
                type="button"
                onClick={() => handleModeChange('nip')}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${mode === 'nip'
                  ? 'bg-white text-[#0b6330] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <FontAwesomeIcon icon={faIdCard} className="w-3 h-3" />
                {t.modeNip}
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('email')}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${mode === 'email'
                  ? 'bg-white text-[#0b6330] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3" />
                {t.modeEmail}
              </button>
            </div>

            {/* Form Konten Berdasarkan Mode & Step */}
            {mode === 'nip' ? (
              nipStep === 'input_nip' ? (
                /* STEP 1: INPUT NIP & KIRIM OTP WHATSAPP */
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {t.labelNip} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nipInput}
                      onChange={(e) => setNipInput(e.target.value)}
                      placeholder={t.placeholderNip}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0b6330] bg-gray-50/50 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-800 text-xs">
                    <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span>{t.otpInfoNotice}</span>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#0b6330] hover:bg-[#074722] text-white font-extrabold px-7 py-3 rounded-xl text-sm shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                          {t.sendingOtpBtn}
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faWhatsapp} className="text-white text-base" />
                          {t.btnSendOtp}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* STEP 2: INPUT KODE OTP WHATSAPP & VERIFIKASI */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Alert Info Nomor Terdaftar */}
                  <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {t.otpSentNotice}
                        </p>
                        <p className="text-sm font-black font-mono text-[#0b6330] tracking-wider mt-0.5">
                          {maskedPhone}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          NIP: <span className="font-bold text-gray-700">{nipInput}</span>
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5 font-semibold">
                          {t.otpContactNotice}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNipStep('input_nip')}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer self-start sm:self-center"
                    >
                      {t.changeNipBtn}
                    </button>
                  </div>

                  {/* Input OTP 6 Digit */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {t.otpInputLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={otpInputRef}
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/[^\d]/g, ''))}
                        placeholder={t.otpPlaceholder}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-center text-lg font-black tracking-[0.4em] focus:outline-none focus:border-[#0b6330] bg-gray-50/50 focus:bg-white transition-all font-mono"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold pointer-events-none">
                        {otpInput.length}/6
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faLock} className="w-3 h-3 text-gray-400" />
                      {t.otpSecurityNotice}
                    </p>
                  </div>

                  {/* Aksi Verifikasi & Kirim Ulang */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    {/* Tombol Kirim Ulang dengan Timer */}
                    <div>
                      <button
                        type="button"
                        disabled={cooldown > 0 || resendLoading}
                        onClick={handleResendOtp}
                        className="text-xs font-bold text-[#0b6330] hover:text-[#074722] disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-1.5 cursor-pointer py-1"
                      >
                        <FontAwesomeIcon icon={faRotateRight} className={resendLoading ? 'animate-spin' : ''} />
                        <span>
                          {cooldown > 0
                            ? `${t.resendWaitText} (${cooldown}s)`
                            : t.btnResendOtp}
                        </span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpInput.length !== 6}
                      className="bg-[#0b6330] hover:bg-[#074722] text-white font-extrabold px-7 py-3 rounded-xl text-sm shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                          {t.verifyingOtpBtn}
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faShieldHalved} />
                          {t.btnVerifyOtp}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )
            ) : (
              /* EMAIL MODE */
              <form onSubmit={handleSearchEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {t.labelEmail} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={t.placeholderEmail}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0b6330] bg-gray-50/50 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0b6330] hover:bg-[#074722] text-white font-extrabold px-7 py-3 rounded-xl text-sm shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        {t.searchingBtn}
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSearch} />
                        {t.searchBtn}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {error && (
              <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-start gap-2.5">
                <span className="shrink-0 text-sm">⚠️</span>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}
          </div>

          {/* HASIL DATA RIWAYAT */}
          {data && (
            <>
              {/* Header Info Pembayar & Total Nominal (Lunas) */}
              <div className="bg-gradient-to-br from-[#0b6330] to-[#043318] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl shrink-0 border border-white/10">
                      <FontAwesomeIcon icon={faUserCheck} className="text-[#ffc800]" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {data.nama || t.donaturDefault}
                      </h2>
                      <p className="text-xs text-emerald-200 font-mono mt-0.5">
                        {isDosen ? (
                          <>
                            NIP: <span className="font-bold text-white">{data.nip}</span>
                            {data.unitKerja && <span className="ml-2 opacity-80">• {data.unitKerja}</span>}
                          </>
                        ) : (
                          <>
                            Email: <span className="font-bold text-white">{data.email}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
                    <span>{t.resetSearchBtn}</span>
                  </button>
                </div>

                {/* Total Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#ffc800]/20 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faCoins} className="text-[#ffc800] w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                        {t.totalZakatLunas}
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-white">
                        {formatRupiah(data.totalZakatLunas)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faHandHoldingHeart} className="text-emerald-300 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                        {t.totalInfaqLunas}
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-white">
                        {formatRupiah(data.totalInfaqLunas)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* BAGIAN 1: RIWAYAT ZAKAT */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h4 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCoins} className="text-[#0b6330]" />
                    {t.titleRiwayatZakat}
                  </h4>
                  <span className="text-xs text-gray-400 font-bold">
                    {data.riwayatZakat.length} {t.transaksiSuffix}
                  </span>
                </div>

                {data.riwayatZakat.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className={`w-full text-xs text-gray-700 ${isAr ? 'text-right' : 'text-left'}`}>
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold">
                          <th className="py-3 px-4">{t.thTanggal}</th>
                          <th className="py-3 px-4">{t.thJenisZakat}</th>
                          <th className="py-3 px-4">{t.thSumberDana}</th>
                          <th className="py-3 px-4">{t.thJumlah}</th>
                          <th className="py-3 px-4 text-center">{t.thStatus}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.riwayatZakat.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap text-gray-600 font-medium">
                              {formatTanggal(item.created_at)}
                            </td>
                            <td className="py-3 px-4 font-bold capitalize text-gray-900">
                              {item.jenis_zakat}
                            </td>
                            <td className="py-3 px-4 text-gray-500">
                              {item.sumber_dana || '—'}
                            </td>
                            <td className="py-3 px-4 font-bold text-[#0b6330]">
                              {formatRupiah(item.jumlah_zakat)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {statusBadge(item.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic py-4 text-center">
                    {t.noZakatData}
                  </p>
                )}
              </div>

              {/* BAGIAN 2: REKAP ZAKAT (khusus mode NIP / dosen) */}
              {isDosen && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Header dengan Tombol / Link "Lihat Rekap Zakat" */}
                  <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-50 via-white to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                    <div>
                      <h4 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileInvoice} className="text-[#0b6330]" />
                        {t.titleRekapTahunan}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {t.subRekapTahunan}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowRekapSection((prev) => !prev)}
                      className="inline-flex items-center justify-center gap-2 bg-[#0b6330] hover:bg-[#074722] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      <span>{showRekapSection ? t.btnSembunyikanRekap : t.btnLihatRekap}</span>
                      <FontAwesomeIcon icon={showRekapSection ? faChevronUp : faChevronDown} className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Konten Rekap Zakat dengan Filter Berdasarkan Tahun Rekap */}
                  {showRekapSection && (
                    <div className="p-6 sm:p-8 bg-gray-50/50 space-y-5 animate-fadeIn">
                      {/* Filter Tahun Rekap */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-[#0b6330]" />
                          <span>{t.filterTahunLabel}</span>
                        </div>

                        <select
                          value={selectedTahun}
                          onChange={(e) => setSelectedTahun(e.target.value)}
                          className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-bold bg-white text-gray-800 focus:outline-none focus:border-[#0b6330] cursor-pointer"
                        >
                          <option value="all">{t.semuaTahun}</option>
                          {availableYears.map((yr) => (
                            <option key={yr} value={yr}>
                              {t.tahunPrefix} {yr}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Daftar File Rekap Zakat */}
                      {filteredRekapZakat && filteredRekapZakat.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {filteredRekapZakat.map((rekap) => (
                            <div
                              key={rekap.id}
                              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-[#0b6330] transition-colors shadow-2xs flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#0b6330] flex items-center justify-center shrink-0">
                                  <FontAwesomeIcon icon={faFileInvoice} className="w-5 h-5" />
                                </div>
                                <div>
                                  <h5 className="font-extrabold text-sm text-gray-900">
                                    {t.rekapZakatTahun} {rekap.tahunRekap}
                                  </h5>
                                  <p className="text-[11px] text-gray-400 font-medium">
                                    {t.diupload} {formatTanggal(rekap.createdAt)}
                                  </p>
                                </div>
                              </div>

                              <a
                                href={rekap.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 bg-[#0b6330] hover:bg-[#074722] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0 shadow-2xs"
                              >
                                <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
                                {t.bukaPdf}
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-400">
                          <p className="text-xs font-semibold">
                            {t.noRekapData} ({selectedTahun === 'all' ? t.semuaTahun : selectedTahun}).
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* BAGIAN 3: RIWAYAT INFAQ */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h4 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faHandHoldingHeart} className="text-[#0b6330]" />
                    {t.titleRiwayatInfaq}
                  </h4>
                  <span className="text-xs text-gray-400 font-bold">
                    {data.riwayatInfaq.length} {t.transaksiSuffix}
                  </span>
                </div>

                {data.riwayatInfaq.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className={`w-full text-xs text-gray-700 ${isAr ? 'text-right' : 'text-left'}`}>
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold">
                          <th className="py-3 px-4">{t.thTanggal}</th>
                          <th className="py-3 px-4">{t.thJenisInfaq}</th>
                          <th className="py-3 px-4">{t.thJumlah}</th>
                          <th className="py-3 px-4 text-center">{t.thStatus}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.riwayatInfaq.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap text-gray-600 font-medium">
                              {formatTanggal(item.created_at)}
                            </td>
                            <td className="py-3 px-4 text-gray-900">
                              <p className="font-bold capitalize">{item.jenis_infaq}</p>
                              {item.kampanye_judul && (
                                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                                  {t.programPrefix} {item.kampanye_judul}
                                </p>
                              )}
                            </td>
                            <td className="py-3 px-4 font-bold text-[#0b6330]">
                              {formatRupiah(item.jumlah_infaq)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {statusBadge(item.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic py-4 text-center">
                    {t.noInfaqData}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}