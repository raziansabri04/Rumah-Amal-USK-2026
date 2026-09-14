'use client';

import { useState } from 'react';
import { updateNisabConfig } from '@/actions/nisab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCheckCircle, faCoins, faScaleBalanced, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { formatRupiah } from '@/lib/kalkulator';
import { formatThousand, parseRawNumber } from '@/lib/formatNumber';

type NisabConfigType = {
  id: string;
  hargaEmasPerGram: number;
  nisabEmasGram: number;
  nisabProfesiBulan: number;
  aturanQanun: string | null;
  skNisabProfesi: string | null;
  updatedAt: Date;
};

export default function NisabClient({ initialData }: { initialData: NisabConfigType }) {
  const [hargaEmasPerGram, setHargaEmasPerGram] = useState(initialData.hargaEmasPerGram);
  const [nisabEmasGram, setNisabEmasGram] = useState(initialData.nisabEmasGram);
  const [nisabProfesiBulan, setNisabProfesiBulan] = useState(initialData.nisabProfesiBulan);
  const [aturanQanun, setAturanQanun] = useState(initialData.aturanQanun || 'Qanun Aceh No. 10/2018 tentang Baitul Mal');
  const [skNisabProfesi, setSkNisabProfesi] = useState(initialData.skNisabProfesi || 'SK DPS BMA No. 02/2024');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const nisabMaalRupiah = nisabEmasGram * hargaEmasPerGram;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await updateNisabConfig({
        hargaEmasPerGram: Number(hargaEmasPerGram),
        nisabEmasGram: Number(nisabEmasGram),
        nisabProfesiBulan: Number(nisabProfesiBulan),
        aturanQanun,
        skNisabProfesi,
      });

      if (res.success) {
        setSuccessMsg('Pengaturan Nisab Zakat berhasil disimpan!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.error || 'Gagal menyimpan pengaturan nisab');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold text-xl">
            <FontAwesomeIcon icon={faScaleBalanced} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pengaturan Nisab Zakat</h1>
            <p className="text-xs text-gray-500">
              Kelola variabel harga emas, nisab emas, nisab profesi bulanan, serta acuan peraturan/SK untuk kalkulator zakat.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Input Pengaturan */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-5">
          <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <FontAwesomeIcon icon={faCoins} className="text-amber-500" />
            Variabel Nisab & Peraturan
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Aturan Qanun
            </label>
            <input
              type="text"
              required
              value={aturanQanun}
              onChange={(e) => setAturanQanun(e.target.value)}
              placeholder="Contoh: Qanun Aceh No. 10/2018 tentang Baitul Mal"
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Teks peraturan umum yang menjadi landasan zakat (tampil di Poin 1 kalkulator).
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              SK Peraturan Nisab Zakat Profesi
            </label>
            <input
              type="text"
              required
              value={skNisabProfesi}
              onChange={(e) => setSkNisabProfesi(e.target.value)}
              placeholder="Contoh: SK DPS BMA No. 02/2024"
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Nama SK / Peraturan acuan khusus untuk Zakat Profesi (tampil di Poin 2 kalkulator).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Harga Emas per Gram (Rp)
              </label>
              <input
                type="text"
                required
                value={formatThousand(hargaEmasPerGram)}
                onChange={(e) => setHargaEmasPerGram(Number(parseRawNumber(e.target.value)))}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330] font-medium"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Acuan harga pasar emas murni saat ini.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nisab Emas (Gram)
              </label>
              <input
                type="number"
                required
                min={0}
                step="0.1"
                value={nisabEmasGram}
                onChange={(e) => setNisabEmasGram(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330]"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Standar nisab zakat emas (umumnya 94 atau 85 gram).
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Nisab Zakat Profesi per Bulan (Rp)
            </label>
            <input
              type="text"
              required
              value={formatThousand(nisabProfesiBulan)}
              onChange={(e) => setNisabProfesiBulan(Number(parseRawNumber(e.target.value)))}
              className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#0b6330] font-medium"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Batas minimum penghasilan bulanan untuk diwajibkan zakat profesi (2,5%).
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#063A1E] hover:bg-[#042714] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>

        {/* Live Preview Halaman Kalkulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
              <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
              Preview Tampilan Kalkulator Zakat
            </h2>

            <div className="bg-amber-50/70 border-l-4 border-[#FFBB0C] p-4 rounded-r-xl text-xs text-gray-800 space-y-2">
              <p className="font-extrabold text-[#000]">Ketentuan Perhitungan Zakat (BMA / USK):</p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700 font-medium leading-relaxed">
                <li>{aturanQanun || 'Qanun Aceh No. 10/2018 tentang Baitul Mal'}</li>
                <li>
                  {skNisabProfesi || 'SK DPS BMA No. 02/2024'}: Nisab Zakat Profesi 2,5% dari Penghasilan Min. <span className="font-bold text-gray-900">{formatRupiah(nisabProfesiBulan)} / bulan</span>
                </li>
                <li>
                  Nisab Zakat setara <span className="font-bold text-gray-900">{nisabEmasGram} gram</span> Emas murni (<span className="font-bold text-gray-900">{formatRupiah(nisabMaalRupiah)}</span>)
                </li>
                <li>
                  Harga Emas murni acuan: <span className="font-bold text-gray-900">{formatRupiah(hargaEmasPerGram)} / gram</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-200/60 text-xs">
              <p className="font-bold text-gray-800">Ringkasan Hasil Perhitungan Nisab:</p>
              <div className="flex justify-between py-1 border-b border-gray-200 text-gray-600">
                <span>Nisab Profesi (Per Bulan)</span>
                <span className="font-semibold text-gray-900">{formatRupiah(nisabProfesiBulan)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200 text-gray-600">
                <span>Nisab Maal / Perniagaan (Setahun)</span>
                <span className="font-semibold text-gray-900">{formatRupiah(nisabMaalRupiah)}</span>
              </div>
              <div className="flex justify-between py-1 text-gray-600">
                <span>Persentase Zakat</span>
                <span className="font-semibold text-emerald-700">2,5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
