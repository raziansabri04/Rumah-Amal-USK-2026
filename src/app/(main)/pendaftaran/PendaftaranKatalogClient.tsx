'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faCalendarAlt,
  faFileAlt,
  faArrowRight,
  faSearch,
  faCheckCircle,
  faInfoCircle,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

interface ProgramItem {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string | null;
  gambarUrl: string | null;
  status: string;
  tanggalBuka: Date | string | null;
  tanggalTutup: Date | string | null;
  linkDriveTemplate: string | null;
  _count: {
    documentFields: number;
    biodataFields: number;
  };
}

export default function PendaftaranKatalogClient({
  initialPrograms,
}: {
  initialPrograms: ProgramItem[];
}) {
  const [search, setSearch] = useState('');

  const filteredPrograms = initialPrograms.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    (p.deskripsi && p.deskripsi.toLowerCase().includes(search.toLowerCase()))
  );

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Tidak ditentukan';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/60 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1280px] mx-auto space-y-10">

        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063A1E] to-[#0b6330] text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider border border-white/15">
              <FontAwesomeIcon icon={faGraduationCap} className="w-3.5 h-3.5" />
              <span>Portal Pendaftaran Resmi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Pendaftaran Program Bantuan & Beasiswa
            </h1>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Rumah Amal Masjid Jamik USK menyalurkan amanah zakat, infaq, dan shadaqah untuk membantu mahasiswa dan masyarakat berprestasi yang membutuhkan melalui proses verifikasi yang transparan dan akuntabel.
            </p>
          </div>

          {/* Background Decorative Pattern */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
            <FontAwesomeIcon icon={faGraduationCap} className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* ALUR SINGKAT PENDAFTARAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-[#0b6330] flex items-center justify-center font-black text-base shrink-0">
              1
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Pilih Program & Siapkan Berkas</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Pilih program yang sesuai kriteria Anda dan unduh template dokumen resmi yang disediakan.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-base shrink-0">
              2
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Isi Formulir & Unggah Berkas</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Lengkapi data diri serta unggah berkas yang diminta secara rapi dan jelas.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-base shrink-0">
              3
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Dapatkan Token & Verifikasi</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Simpan token unik pendaftaran Anda untuk memantau status atau memperbaiki berkas bila diperlukan.
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH & TITLE BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Program Terbuka Saat Ini</h2>
            <p className="text-xs text-gray-500 mt-1">
              Menampilkan {filteredPrograms.length} program bantuan & beasiswa yang siap menerima pendaftaran.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari program bantuan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0b6330] focus:ring-1 focus:ring-[#0b6330] shadow-2xs"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3.5 top-3.5 text-gray-400 w-3.5 h-3.5"
            />
          </div>
        </div>

        {/* LIST PROGRAM CARDS */}
        {filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
              <FontAwesomeIcon icon={faInfoCircle} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Belum Ada Program Terbuka</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Saat ini belum ada pendaftaran program bantuan atau beasiswa yang sedang dibuka. Pantau terus pengumuman berkala kami.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="group bg-white rounded-3xl border border-gray-100/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image / Header Graphic */}
                <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                  {program.gambarUrl ? (
                    <Image
                      src={program.gambarUrl}
                      alt={program.nama}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#063A1E]/10 to-[#0b6330]/20 text-[#0b6330]">
                      <FontAwesomeIcon icon={faGraduationCap} className="w-12 h-12 opacity-80" />
                    </div>
                  )}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/95 text-white text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Pendaftaran Dibuka
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h3 className="text-lg font-black text-gray-900 group-hover:text-[#0b6330] transition-colors line-clamp-2">
                      {program.nama}
                    </h3>

                    {program.deskripsi && (
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed font-normal">
                        {program.deskripsi}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    {/* Jadwal Buka - Tutup */}
                    <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 h-3.5 text-[#0b6330]" />
                        Batas Waktu:
                      </span>
                      <span className="font-bold text-gray-800">
                        {formatDate(program.tanggalTutup)}
                      </span>
                    </div>

                    {/* Dokumen Count */}
                    <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <FontAwesomeIcon icon={faFileAlt} className="w-3.5 h-3.5 text-amber-600" />
                        Syarat Berkas:
                      </span>
                      <span className="font-bold text-gray-800">
                        {program._count.documentFields} Dokumen
                      </span>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/pendaftaran/${program.slug}`}
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#0b6330] hover:bg-[#063A1E] text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 group-hover:shadow-green-900/20 cursor-pointer"
                    >
                      <span>Buka Formulir Pendaftaran</span>
                      <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAQ KILAT */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-[#0b6330] flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faQuestionCircle} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Pertanyaan Umum Seputar Pendaftaran</h3>
              <p className="text-xs text-gray-500">Hal-hal yang sering ditanyakan oleh calon pendaftar.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600">
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1.5">
              <h4 className="font-bold text-gray-900 text-sm">Apakah saya perlu membuat akun untuk mendaftar?</h4>
              <p className="leading-relaxed">
                Tidak. Sistem pendaftaran Rumah Amal USK berbasis token. Anda cukup mengisi formulir dan sistem akan menerbitkan token verifikasi unik untuk Anda.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1.5">
              <h4 className="font-bold text-gray-900 text-sm">Format dokumen apa saja yang didukung?</h4>
              <p className="leading-relaxed">
                File scan/dokumen dapat diunggah dalam format PDF, JPG, atau PNG dengan batas ukuran maksimal 10MB per berkas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1.5">
              <h4 className="font-bold text-gray-900 text-sm">Di mana saya bisa mengunduh format surat rekomendasi?</h4>
              <p className="leading-relaxed">
                Di dalam halaman formulir pendaftaran tiap program, terdapat tombol langsung menuju folder Google Drive resmi berisi seluruh template dokumen yang dibutuhkan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1.5">
              <h4 className="font-bold text-gray-900 text-sm">Bagaimana jika salah satu berkas saya ditolak atau buram?</h4>
              <p className="leading-relaxed">
                Sistem akan memverifikasi berkas Anda secara otomatis. Jika ditemukan ketidaksesuaian, Anda akan menerima email pemberitahuan dengan link perbaikan tanpa perlu mengisi ulang seluruh form.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
