Saya ingin mengimplementasikan sistem pendaftaran program rumah amal ke dalam project
Next.js yang sudah ada ini. Sebelum mulai, pelajari dulu struktur project ini (App
Router/Pages Router, TypeScript config, folder structure, konvensi yang sudah ada) dan
ikuti pola yang sudah ada.

CATATAN DEPLOYMENT PENTING: untuk tahap testing awal, project ini akan di-deploy di
Vercel (serverless). Untuk produksi nanti, akan pindah ke server institusi self-hosted
(usk.ac.id) dengan Node.js. KARENA HARUS JALAN DI KEDUA LINGKUNGAN, semua logic HARUS
kompatibel dengan batasan serverless (tidak ada proses yang hidup terus-menerus/
long-running process, tidak ada in-memory state yang mengandalkan proses tetap hidup
antar-request). Worker asinkron (lihat bagian PROSES ASINKRON & WORKER) harus dibangun
sebagai API route stateless yang memproses satu batch lalu selesai, dipicu penjadwal
dari luar (Vercel Cron Jobs saat di Vercel, cron job OS biasa saat di usk.ac.id) -
BUKAN sebagai script dengan loop tak berhenti.

PENTING - PRINSIP KERJA: Kalau di tengah implementasi ada instruksi di bawah yang
terasa ambigu, kontradiktif dengan struktur project yang sudah ada, atau ada keputusan
desain yang berdampak besar dan belum jelas jawabannya di sini - TANYAKAN ke saya dulu
sebelum melanjutkan, jangan menebak sendiri.

PENTING - KONSISTENSI UI/STYLE: SEMUA halaman baru (form pendaftaran publik, halaman
daftar program, dashboard admin CMS, halaman `/perbaiki/[token]`, dst) HARUS memakai
UI dan gaya visual yang SAMA PERSIS dengan website yang sudah ada - bukan gaya baru
yang beda sendiri. Sebelum membuat halaman apa pun, periksa dan ikuti:
- Design tokens yang sudah ada (warna, spacing, radius, shadow) - biasanya di
  `tailwind.config`, file CSS global, atau folder `theme`/`design-system`
- Komponen UI yang sudah dipakai di website (button, input, card, navbar, footer,
  dst) - PAKAI ULANG komponen yang sudah ada, jangan bikin versi baru yang mirip tapi
  beda kalau komponennya sudah tersedia
- Font, ukuran teks, dan hierarki tipografi yang sudah dipakai
- Pola layout halaman yang sudah ada (lebar konten, padding, breakpoint responsive)
- Kalau website sudah pakai library komponen tertentu (misal shadcn/ui, Radix,
  Material UI, dst), gunakan library yang sama, jangan campur dengan library lain
Kalau ternyata website yang sudah ada TIDAK punya sistem desain yang jelas/konsisten
untuk dijadikan acuan, TANYAKAN ke saya dulu sebelum menentukan gaya sendiri untuk
halaman-halaman baru ini.

=======================================================================
KONTEKS BISNIS
=======================================================================
Rumah Amal Masjid Jamik Universitas Syiah Kuala mengelola 10 program bantuan/beasiswa
berbeda, masing-masing dengan syarat dokumen dan biodata yang berbeda-beda. Selama ini
semua program pakai Google Form terpisah-pisah, menyulitkan admin menyeleksi karena
dokumen pendaftar tersebar di banyak file. Tujuan sistem baru:
1. Satu platform terpadu untuk semua program, dikelola dinamis oleh admin (bukan
   hardcode per program di kode)
2. Dokumen pendaftar otomatis digabung jadi satu file per pendaftar untuk memudahkan
   seleksi admin
3. Validasi otomatis (kelengkapan, kecocokan jenis dokumen, masa berlaku, kecocokan
   nama) untuk mengurangi beban verifikasi manual - tapi SELALU sebagai warning/flag
   untuk admin, TIDAK PERNAH auto-tolak pendaftar, karena akurasi OCR tidak bisa
   dijamin 100% dan konsekuensi salah tolak itu serius

=======================================================================
KEPUTUSAN ARSITEKTUR YANG SUDAH DIPUTUSKAN (jangan diubah tanpa konfirmasi)
=======================================================================
- Storage dokumen mentah & PDF gabungan: Google Drive, via Service Account
  (package `googleapis`), folder terstruktur per program lalu per pendaftar
- Storage data pendaftar & konfigurasi program: **Neon** (Postgres serverless, free tier,
  scale-to-zero otomatis bangun lagi saat ada request - cocok untuk pola pemakaian
  sistem ini yang aktif-dormant per periode pendaftaran) - BUKAN Google Sheets, karena
  skema biodata berbeda-beda tiap program dan butuh dikelola dinamis lewat CMS admin.
  Database ini independen dari tempat hosting aplikasi - saat pindah dari Vercel
  (testing) ke usk.ac.id (produksi), Neon TETAP dipakai, tidak perlu migrasi database,
  cukup ganti tempat hosting aplikasinya saja. Pakai ORM yang sudah ada di project
  kalau sudah ada (Prisma/Drizzle/dst), jangan pasang yang baru tanpa perlu.
- OCR: `tesseract.js` (jalan di server sendiri, gratis tanpa batas kuota) - BUKAN
  Google Cloud Vision API, karena volume pemanggilan (banyak dokumen x banyak
  pendaftar x banyak program) berpotensi melebihi kuota gratis Cloud Vision
- Merge dokumen jadi PDF: library `pdf-lib` (merge halaman PDF asli, convert gambar
  jadi halaman PDF)
- Proses verifikasi dokumen (OCR, merge, dll) berjalan ASINKRON lewat worker terpisah
  (dijalankan cron/scheduler), TIDAK dilakukan langsung di request submit form,
  supaya submit tetap cepat dan server tidak kewalahan
- Notifikasi & perbaikan dokumen ke pendaftar: TIDAK pakai sistem akun/login. Pakai
  token unik acak (`crypto.randomUUID()`) per submission, dikirim lewat email berisi
  link untuk membuka halaman perbaikan dokumen spesifik
- Kredensial (Service Account, database, dll) disimpan sebagai environment variable,
  sertakan file `.env.example` tanpa nilai asli, JANGAN commit kredensial ke repo

=======================================================================
DATA MODEL YANG DIBUTUHKAN
=======================================================================

**Program**
- id, nama, deskripsi, gambar/logo (upload, simpan di Drive atau storage lain)
- status: draft / dibuka / ditutup
- tanggal_buka, tanggal_tutup (admin atur, dipakai untuk otomatis menutup pendaftaran)
- link_drive_template (URL folder Google Drive berisi template dokumen yang perlu
  diisi pendaftar, misal format surat rekomendasi, surat pernyataan, dll)
- daftar syarat_dokumen (relasi ke DocumentField, lihat di bawah)
- daftar syarat_biodata (relasi ke BiodataField, lihat di bawah)

**DocumentField** (field upload dokumen milik satu Program)
- key (contoh: 'ktp', 'surat_rekomendasi_rektor')
- label (contoh: 'KTP', 'Surat Rekomendasi Rektor')
- required: boolean
- maxAgeMonths: angka atau kosong (batas masa berlaku dokumen, dihitung dari tanggal
  di surat vs tanggal submit form - BUKAN tanggal upload ulang kalau ada revisi)
- expectedKeywords: array kata kunci untuk validasi kecocokan jenis dokumen (kosongkan
  untuk dokumen yang tidak berupa teks, misal pas foto)
- nameCheckApplicable: boolean - apakah nama pendaftar perlu dicocokkan dengan isi
  dokumen ini. HARUS false untuk dokumen yang diisi/ditandatangani oleh pihak lain
  (surat rekomendasi dari dosen wali/rektor/kaprodi, dokumen bertandatangan kepala
  desa, dokumen atas nama orang tua/suami/istri, dsb) - default false kecuali
  eksplisit diset true untuk dokumen identitas milik pendaftar sendiri (KTP, KTM,
  surat keterangan tidak mampu yang mencantumkan nama pendaftar)
- isSingleCombinedUpload: boolean - true untuk field seperti 'Foto Rumah' di mana
  PENDAFTAR SENDIRI yang menggabungkan beberapa foto (tampak depan, ruang tamu, dapur,
  kamar tidur, kamar mandi, dsb) jadi SATU file sebelum upload, mengikuti template
  tata letak yang disediakan link Drive-nya. Field seperti ini tetap divalidasi
  required/ada-tidaknya, TAPI tidak perlu logic sub-merge di server - file yang
  diupload langsung dipakai apa adanya sebagai satu bagian dari PDF gabungan akhir
- needsStampCheck: boolean - flag untuk admin cek stempel/tandatangan basah secara
  manual, JANGAN dideteksi otomatis (akurasi tidak bisa diandalkan untuk keputusan)

**BiodataField** (field data diri, milik satu Program, dinamis)
- key, label, tipe (text/number/select/date/textarea/radio)
- options (untuk tipe select/radio)
- required: boolean
- PENGECUALIAN PENTING: JANGAN PERNAH membuat field biodata untuk "tanggal
  pendaftaran/tanggal daftar" - ini SELALU diambil otomatis dari timestamp submit,
  tidak pernah jadi input manual. Kalau menemukan referensi field seperti itu di
  requirement program, jangan buat sebagai BiodataField, cukup catat sebagai
  createdAt/submittedAt di level record submission.

**Submission** (satu pendaftaran)
- id, programId, token (UUID unik untuk akses perbaikan tanpa login)
- biodataValues (JSON, sesuai BiodataField program terkait)
- documentUploads (relasi ke file per DocumentField)
- status: 'menunggu_diproses' | 'sedang_diproses' | 'belum_diseleksi' | 'lolos' |
  'tidak_lolos' | 'gagal_diproses'
- warnings (JSON array, hasil dari proses verifikasi - OCR gagal baca, dokumen tidak
  sesuai, kadaluarsa, nama tidak cocok, dll)
- linkDokumenGabungan (URL PDF hasil merge di Drive)
- submittedAt (otomatis, timestamp server, BUKAN input manual)

=======================================================================
FITUR ADMIN CMS
=======================================================================
1. CRUD Program: tambah/edit/hapus program, upload/ganti logo, atur tanggal buka-tutup
   pendaftaran (atau toggle manual buka/tutup)
2. Builder syarat dokumen per program: tambah/hapus/edit DocumentField dengan semua
   flag di atas (required, maxAgeMonths, expectedKeywords, nameCheckApplicable,
   isSingleCombinedUpload, needsStampCheck)
3. Builder syarat biodata per program: tambah/hapus/edit BiodataField (dengan tipe
   field dan opsi kalau select/radio)
4. Input link Google Drive template dokumen per program (field teks URL biasa)
5. Halaman daftar submission per program dengan filter status, menampilkan warning
   yang ditemukan sistem, link PDF gabungan, dan aksi ubah status (lolos/tidak
   lolos/dst) - INI YANG MENGGANTIKAN peran Google Sheet di rancangan lama, karena
   sekarang datanya di database sendiri

=======================================================================
FITUR PENDAFTARAN (SISI PUBLIK/PENDAFTAR)
=======================================================================
1. Halaman daftar program yang sedang dibuka (ambil dari status Program di database)
2. Halaman form pendaftaran per program - dirender DINAMIS berdasarkan BiodataField
   dan DocumentField program tersebut (bukan form hardcode)
3. Tombol/link yang mengarah ke link_drive_template program tersebut, untuk pendaftar
   mengunduh/mengisi template dokumen yang diperlukan (surat rekomendasi, template
   tata letak foto rumah, dll)
4. Validasi required di client-side sebagai first line of defense (bukan satu-satunya
   lapis validasi)
5. Setelah submit: validasi ulang di server (jangan percaya client saja), simpan file
   mentah, buat Submission baru dengan status 'menunggu_diproses' dan token unik,
   balas cepat ke pendaftar ("pendaftaran diterima, sedang diverifikasi")
6. Halaman `/perbaiki/[token]` - pendaftar buka dari link di email, lihat dokumen
   mana saja yang perlu diperbaiki (dari field `warnings`), upload ulang HANYA
   dokumen yang bermasalah tanpa mengisi ulang seluruh form, submission kembali ke
   status 'menunggu_diproses' untuk diverifikasi ulang

=======================================================================
PIPELINE VERIFIKASI DOKUMEN (dijalankan oleh worker asinkron, bukan di request submit)
=======================================================================
Untuk setiap Submission berstatus 'menunggu_diproses', worker melakukan (per
DocumentField sesuai konfigurasi programnya):
1. Validasi kelengkapan (dokumen required tapi kosong -> tolak sebelum proses lain)
2. Untuk field dengan expectedKeywords: jalankan OCR (tesseract.js), cek apakah teks
   hasil OCR mengandung minimal satu keyword yang diharapkan -> kalau tidak, catat
   warning "kemungkinan salah upload file"
3. Untuk field dengan maxAgeMonths: cari pola tanggal di teks OCR (format "12 Maret
   2026" dan "12/03/2026"), hitung selisih bulan dari `submittedAt` (BUKAN dari
   tanggal proses berjalan, karena proses bisa telat beberapa menit dari waktu submit
   asli) -> kalau lebih dari batas, atau tanggal tidak terbaca, catat warning
4. Untuk field dengan nameCheckApplicable=true: cocokkan nama pendaftar (dari
   biodataValues) dengan teks OCR pakai fuzzy matching (library seperti
   `fastest-levenshtein` atau `string-similarity`, BUKAN exact match karena OCR bisa
   salah baca huruf) -> kalau skor kemiripan di bawah ambang batas, catat warning.
   SKIP pengecekan ini sepenuhnya untuk field dengan nameCheckApplicable=false
5. Untuk field dengan needsStampCheck=true: JANGAN coba deteksi otomatis, cukup
   sertakan sebagai daftar terpisah "perlu cek stempel manual" di hasil akhir
6. Untuk field isSingleCombinedUpload=true (foto rumah dkk): lewati langkah 2-4 kalau
   kontennya bukan teks (biasanya foto), tapi tetap sertakan filenya apa adanya ke
   proses merge PDF akhir
7. Gabungkan SEMUA file dokumen milik Submission ini (via `pdf-lib`) jadi SATU PDF
   utuh, upload ke Google Drive di folder program+pendaftar terkait
8. Update Submission: status jadi 'belum_diseleksi', simpan `linkDokumenGabungan` dan
   seluruh `warnings` yang terkumpul
9. Kalau ada warning yang butuh tindakan pendaftar (dokumen salah/tidak sesuai, nama
   tidak cocok, dokumen kadaluarsa) - kirim email otomatis berisi link
   `/perbaiki/[token]` dan daftar dokumen yang perlu diperbaiki

=======================================================================
PROSES ASINKRON & WORKER
=======================================================================
- Worker HARUS berbentuk API route biasa (misal `/api/worker/proses-antrean`), BUKAN
  script dengan loop tak berhenti - karena harus jalan di Vercel (serverless, testing)
  maupun usk.ac.id (self-hosted, produksi) tanpa perlu ditulis ulang
- Endpoint ini dipicu dari LUAR secara berkala (tiap 1-2 menit): pakai Vercel Cron
  Jobs (`vercel.json`) saat di Vercel, atau cron job OS yang `curl` ke endpoint yang
  sama saat di usk.ac.id
- Tiap kali dipanggil, endpoint ini memproses SATU BATCH Submission berstatus
  'menunggu_diproses' (batasi jumlahnya per batch, misal maks 5-10 sekaligus, supaya
  tidak kena timeout eksekusi function di Vercel), lalu selesai (return response) -
  bukan menunggu semua antrean habis dalam satu eksekusi
- Amankan endpoint ini dari akses publik sembarangan (misal cek header secret/token
  rahasia yang cuma diketahui penjadwal cron, taruh sebagai environment variable)
- Saat mulai memproses satu Submission, LANGSUNG ubah statusnya jadi
  'sedang_diproses' dulu (row-level lock sederhana) supaya tidak diproses dobel
  kalau worker berikutnya jalan sebelum yang ini selesai
- Kalau Submission macet di status 'sedang_diproses' lebih dari, misal, 15 menit
  tanpa update, anggap gagal -> ubah ke 'gagal_diproses' untuk dicek admin manual,
  jangan biarkan nyangkut selamanya
- Kirim email notifikasi pakai layanan dengan kuota gratis (misal Resend atau Brevo)

=======================================================================
DAFTAR PROGRAM & SYARAT LENGKAP (data awal untuk seed/referensi implementasi)
=======================================================================
Catatan: beberapa program di bawah belum ada detail syarat dokumen/biodatanya
(ditandai "(belum ada detail)") - untuk program seperti ini, CMS harus tetap bisa
menyimpannya dengan daftar syarat kosong (form pendaftaran otomatis jadi lebih
sederhana, hanya field generik/dasar), JANGAN dianggap error atau butuh syarat
minimum tertentu.

1. **BPRA-UKT** (Beasiswa Pendidikan Rumah Amal - Uang Kuliah Tunggal)
   Dokumen: Surat Permohonan Bantuan; Surat Rekomendasi dari Dosen Wali/Kaprodi/WD III
   (nameCheckApplicable=false, tanda tangan digital dibolehkan); Surat Pernyataan;
   Foto Rumah (tampak depan, ruang tamu, dapur, kamar tidur, kamar mandi -
   isSingleCombinedUpload=true, bertandatangan+stempel kepala desa, maxAgeMonths=6);
   Surat Keterangan Tidak Mampu dari Kepala Desa (maxAgeMonths=6, tandatangan+stempel
   basah, nameCheckApplicable=true kalau menyebut nama pendaftar); Surat Aktif Kuliah
   (dilampirkan belakangan setelah lulus jadi penerima, semester ganjil 2026/2027);
   Scan KTM (nameCheckApplicable=true); Scan KTP (nameCheckApplicable=true); Pasfoto
   3x4 (tidak perlu OCR)

2. **Beasiswa OTA Palestina** (belum ada detail dokumen) - CATATAN: berdasarkan
   Syarat Biodata, program ini sebenarnya form DONASI (pendaftar adalah calon
   DONATUR, bukan penerima bantuan) - field: Nama Calon Donatur, No. WhatsApp,
   Instansi Bekerja, Jumlah Donasi (pilihan nominal per kategori), Mulai Donasi
   (tanggal - ini BUKAN "tanggal pendaftaran" jadi TETAP jadi field manual, bukan
   auto timestamp), Pernyataan kesediaan (ya/tidak). Kemungkinan tidak butuh upload
   dokumen sama sekali - CMS harus mendukung Program tanpa DocumentField

3. **Green Qurban** (belum ada detail sama sekali)

4. **PINTAS** (Pinjaman Tanpa Syarat)
   Dokumen: Surat Permohonan; Surat Rekomendasi dari Dosen/Staf USK
   (nameCheckApplicable=false); Bukti status Mahasiswa Aktif/Dosen/Staf USK; Surat
   Pernyataan tidak merokok dan tidak pacaran; Kartu Identitas KTP/KTM
   (nameCheckApplicable=true); Pas foto berwarna

5. **Bantuan Nasi Bungkus**
   Dokumen: Kartu Identitas (KTM dan KTP, nameCheckApplicable=true); Pas foto warna
   Biodata: Nama, NPM, Tempat/Tanggal Lahir, Jenis Kelamin, Fakultas, Prodi, IPK,
   Pekerjaan, Penghasilan/Bulan (dropdown rentang Rp0 - Rp5.000.000+), Anak ke,
   Jumlah Tanggungan Orang Tua, No. WhatsApp, Media Sosial, Alamat Asal, Alamat
   Domisili, Alasan Mendaftar, data lengkap Ayah (nama/usia/pekerjaan/penghasilan/
   alamat/whatsapp), data lengkap Ibu (sama), Nama+Jabatan+WhatsApp Perekomendasi,
   riwayat penerimaan bantuan sebelumnya, Status Rumah, Luas Rumah, Jumlah Tingkat,
   Jenis Bangunan, Aset yang Dimiliki (multi-select)
   (field "Tanggal Daftar" di catatan asli TIDAK dibuat sebagai BiodataField -
   otomatis dari submittedAt)

6. **ECRA** (Entrepreneurship Club Rumah Amal)
   Dokumen: Surat Permohonan; Kartu Tanda Pengenal (KTP dan KTM,
   nameCheckApplicable=true); Surat Keterangan Usaha (opsional, jika ada); Pas foto
   berwarna

7. **P2EMD** (Pemberdayaan Ekonomi Masyarakat Dhuafa)
   Dokumen (SUDAH DIUBAH sesuai keputusan: upload terpisah per dokumen, sistem
   yang menggabungkan otomatis - JANGAN ikuti requirement asli "gabungkan sendiri
   maks 2MB"): Surat Permohonan; Surat Rekomendasi (nameCheckApplicable=false);
   Kartu Tanda Pengenal (nameCheckApplicable=true); Kartu Keluarga; Pas foto
   berwarna; Slip Gaji Pengusul; Slip Gaji Suami/Istri (nameCheckApplicable=false -
   ini nama pasangan, bukan pendaftar); Scan KTP; foto tempat usaha; Rancangan
   Anggaran Biaya; foto rumah (isSingleCombinedUpload=true); Surat Keterangan Tidak
   Mampu (maxAgeMonths=6)
   Biodata: Nama Pengusul, NIK, Jenis Kelamin, Tempat Tanggal Lahir, Usia, No.
   WhatsApp, Alamat Lengkap, Kecamatan, Desa, Jumlah Tanggungan, Status Pernikahan,
   Alasan Mengusulkan, Pekerjaan Pengusul, Penghasilan/Bulan, Nama+Usia+Pekerjaan+
   Penghasilan Suami/Istri, Jenis Usaha, Detail Usaha, Nama Tempat Usaha, Kecamatan
   Tempat Usaha, Alamat Tempat Usaha, Medsos Usaha, Lama Usaha Berjalan, Yang
   Menjalankan Usaha, Kepemilikan Tempat Usaha, Status Kepemilikan Rumah, Luas
   Rumah, Jumlah Tingkat, Jenis Bangunan, Aset yang Dimiliki, Jenis HP & Laptop yang
   digunakan, Pernyataan kesediaan (checklist ketik ulang pernyataan)

8. **Beasiswa Orang Tua Asuh (OTA)**
   Dokumen: Surat Permohonan; Surat Rekomendasi (nameCheckApplicable=false);
   Surat Pernyataan; Transkrip Akademik terbaru (nameCheckApplicable=true); KRS
   terbaru (nameCheckApplicable=true); KTM (nameCheckApplicable=true); Pasfoto 3x4;
   Surat Keterangan Tidak Mampu dari Kepala Desa (maxAgeMonths=6); Foto Rumah
   (tampak depan, belakang, samping kanan-kiri, ruang tamu, dapur, kamar tidur,
   kamar mandi - SEMUA jadi SATU field isSingleCombinedUpload=true, ditandatangani
   kepala desa)
   Biodata: Nama, NPM, Tempat/Tanggal Lahir, Jenis Kelamin, Fakultas, Prodi, IP
   Terbaru, IPK Terbaru, Jumlah SPP, Anak ke, Jumlah Tanggungan Orang Tua, Status
   Pernikahan Orang Tua, No. WhatsApp, Medsos, Alamat Asal, Alamat Domisili, Alasan
   Mendaftar, data lengkap Ayah & Ibu (sama pola dengan program Nasi Bungkus), Nama+
   NIP+Pekerjaan+Jabatan+WhatsApp Perekomendasi, Jabatan Organisasi (maks 3),
   Prestasi (maks 3), Riwayat Beasiswa (termasuk KIP-K), riwayat bantuan dari Rumah
   Amal sebelumnya, Jenis HP & Laptop, Status Rumah, Luas Rumah, Jumlah Tingkat,
   Jenis Bangunan, Aset yang Dimiliki, Pernyataan kesediaan (ketik ulang pernyataan)

9. **Program Beasiswa Mualaf**
   Dokumen: Surat Permohonan; Surat Rekomendasi dari Dosen/Pegawai/Staf USK
   (nameCheckApplicable=false); Surat Pernyataan; Sertifikat Mualaf
   (nameCheckApplicable=true); Kartu Identitas (KTP+KTM bagi mahasiswa,
   nameCheckApplicable=true; ATAU KTS+KTP orang tua/wali bagi yang bukan mahasiswa -
   nameCheckApplicable=false karena atas nama orang tua/wali); Pas foto berwarna

10. **BPMI** (Beasiswa Pendidikan Mahasiswa Internasional)
    Dokumen: Surat Permohonan Bantuan; Rekomendasi dari OIA USK
    (nameCheckApplicable=false); Surat Pernyataan; Scan Surat Pernyataan; Scan KTM
    (nameCheckApplicable=true); Scan Paspor (nameCheckApplicable=true, GANTIKAN KTP
    karena mahasiswa internasional); Pasfoto 3x4

=======================================================================
YANG TIDAK PERLU DIKERJAKAN DI TAHAP INI
=======================================================================
- Sistem backup otomatis (Google Apps Script terpisah, di luar scope prompt ini)
- Autentikasi/login untuk pendaftar (memang tidak diperlukan sama sekali, sesuai
  desain token-based)
- Integrasi WhatsApp untuk notifikasi (mulai dari email dulu)

=======================================================================
URUTAN IMPLEMENTASI YANG DISARANKAN (kerjakan bertahap, jangan sekaligus)
=======================================================================
Fase 1: Data model (skema database) untuk Program, DocumentField, BiodataField,
        Submission
Fase 2: Admin CMS - CRUD Program lengkap dengan builder DocumentField & BiodataField
Fase 3: Halaman pendaftaran publik yang merender form secara dinamis dari data Program
Fase 4: API route submit pendaftaran (validasi dasar, simpan file mentah, buat
        Submission dengan status awal)
Fase 5: Worker asinkron + pipeline verifikasi dokumen lengkap (OCR, keyword check,
        date check, name check, merge PDF)
Fase 6: Notifikasi email + halaman `/perbaiki/[token]`
Fase 7: Seed data awal ke database berdasarkan 10 program di atas, supaya sistem
        langsung bisa dites dengan data nyata

Di akhir tiap fase, ringkas apa yang sudah dibuat dan tanyakan konfirmasi sebelum
lanjut ke fase berikutnya, terutama kalau ada keputusan desain yang tidak eksplisit
diatur di prompt ini.

=======================================================================
OUTPUT YANG DIHARAPKAN DARI FASE PERTAMA
=======================================================================
- Skema database lengkap (migration file atau schema Prisma/Drizzle/dsb sesuai yang
  cocok dengan project)
- Daftar dependency baru yang perlu diinstall
- Daftar environment variable yang dibutuhkan (.env.example)
- Ringkasan setup manual yang perlu saya lakukan (misal buat project Neon, aktifkan
  API tertentu di Google Cloud, dst)
- Ringkasan hasil pemeriksaan design system/komponen UI yang sudah ada di project
  (apa saja yang ditemukan dan akan dipakai ulang untuk halaman-halaman baru)
- Pertanyaan apa pun yang perlu dijawab sebelum lanjut ke fase berikutnya
