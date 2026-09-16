# Panduan Lengkap Setup Lingkungan Lokal (Rumah Amal USK)

Panduan ini berisi langkah-langkah konkret dan urut yang perlu Anda lakukan secara manual untuk menyiapkan kredensial, database, dan environment lokal setelah meng-clone project ini.

---

## 📋 Daftar Layanan Eksternal yang Dibutuhkan

| Layanan | Kebutuhan | Sifat | Gratis? |
| :--- | :--- | :--- | :--- |
| **Neon** | Database serverless PostgreSQL | **Wajib** (agar dev server & Prisma jalan) | ✅ Gratis |
| **Admin Auth (NextAuth)** | Login dashboard admin | **Wajib** (agar bisa akses `/admin`) | ✅ Internal |
| **Google Cloud (Drive API)** | Simpan berkas pendaftar & merge PDF | Wajib untuk fitur Pendaftaran | ✅ Gratis |
| **Resend** | Kirim email perbaikan dokumen (`/perbaiki/[token]`) | Wajib untuk notifikasi email | ✅ Gratis (3.000 email/bln) |
| **Supabase** | Storage media website lama (berita, galeri, dll.) | Diperlukan jika mengetes CMS berita/banner | ✅ Gratis |
| **WA Gateway (Baileys)** | OTP WhatsApp donatur | Opsional (bisa diabaikan dulu) | ✅ Gratis (self-hosted) |
| **DeepL** | Auto-translate berita ke Arab/Inggris | Opsional | Tersedia free tier |

---

## 🚀 Langkah 1: Setup Database PostgreSQL di Neon (Wajib)

1. Buka [https://neon.tech](https://neon.tech) lalu daftar / login dengan akun GitHub atau Google.
2. Klik tombol **"Create Project"**.
   - Berikan nama project, misal: `rumah-amal-db`.
   - Pilih region yang paling dekat: **Singapore (`ap-southeast-1`)** atau yang terdekat dengan Indonesia.
   - Klik **"Create Project"**.
3. Di halaman utama Dashboard Neon (bagian **Connection Details**):
   - Pastikan dropdown memilih **Prisma** atau **Postgres**.
   - Aktifkan toggle / tab **"Pooled connection"** ➔ Salin connection string ini. Ini akan menjadi nilai `DATABASE_URL`.
     Contoh: `postgresql://neondb_owner:xyz...@ep-xyz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
   - Matikan toggle **"Pooled connection"** (Direct connection) ➔ Salin connection string ini. Ini akan menjadi nilai `DIRECT_URL`.
     Contoh: `postgresql://neondb_owner:xyz...@ep-xyz.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

---

## 🔐 Langkah 2: Setup Kredensial Admin Dashboard (Wajib)

Sistem autentikasi admin project ini menggunakan **NextAuth v5** dengan verifikasi hash bcrypt yang dibaca langsung dari environment variable.

1. Tentukan email admin yang ingin digunakan, misal: `admin@rumahamalusk.org`.
2. Hasilkan hash bcrypt dari password admin yang Anda inginkan menggunakan skrip yang sudah tersedia di repository ini:
   ```bash
   node scripts/generate-hash.js Rahasia123!
   ```
   *(Ganti `Rahasia123!` dengan password yang Anda kehendaki).*
3. Terminal akan menampilkan output seperti ini:
   ```text
   === Salin ke .env ===
   ADMIN_EMAIL="rumahamal@usk.ac.id"
   ADMIN_PASSWORD_HASH="\$2a\$10\$..."
   =====================
   ```
   > [!IMPORTANT]
   > Karakter `$` pada hash harus diawali tanda backslash (`\$`) persis seperti output skrip di atas agar Next.js tidak menginterpretasikannya sebagai variabel interpolasi.
4. Buat nilai acak untuk `AUTH_SECRET`:
   - Di terminal Linux/Git Bash: jalankan `openssl rand -base64 32`
   - Atau buat string acak minimal 32 karakter bebas (huruf & angka).

---

## 📁 Langkah 3: Setup Google Drive API & Service Account (Untuk Fitur Pendaftaran)

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat project baru (misal: `Rumah-Amal-USK`) atau pilih project yang sudah ada.
3. **Aktifkan Google Drive API**:
   - Di menu navigasi samping kiri, pilih **APIs & Services** ➔ **Enabled APIs & Services**.
   - Klik **"+ ENABLE APIS AND SERVICES"**.
   - Cari **"Google Drive API"**, klik lalu pilih **Enable**.
4. **Buat Service Account**:
   - Pilih **APIs & Services** ➔ **Credentials**.
   - Klik **"+ CREATE CREDENTIALS"** di bagian atas ➔ Pilih **Service account**.
   - Isi nama Service Account (misal: `drive-storage-worker`) ➔ Klik **Create and Continue**.
   - Role dapat dikosongkan atau pilih **Basic > Editor** ➔ Klik **Continue** ➔ Klik **Done**.
5. **Buat & Unduh Key JSON**:
   - Di daftar Service Accounts, klik email service account yang baru dibuat.
   - Masuk ke tab **Keys** (di bagian atas).
   - Klik **Add Key** ➔ **Create new key** ➔ Pilih format **JSON** ➔ Klik **Create**.
   - File JSON akan terunduh ke komputer Anda. Buka file JSON tersebut dengan text editor.
   - Ambil nilai `"client_email"` ➔ masukkan ke `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
   - Ambil nilai `"private_key"` (termasuk `-----BEGIN PRIVATE KEY-----` dan `-----END PRIVATE KEY-----`) ➔ masukkan ke `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.
6. **Buat & Bagikan Folder di Google Drive**:
   - Buka Google Drive Anda ([https://drive.google.com](https://drive.google.com)).
   - Buat satu folder baru, misalnya bernama: `Pendaftaran Rumah Amal USK`.
   - Buka folder tersebut di browser. Perhatikan URL di address bar browser Anda:
     `https://drive.google.com/drive/folders/1ABCxyz123456789_FolderIDDisini`
     Bagian setelah `/folders/` adalah **Folder ID**. Masukkan nilai ini ke `GOOGLE_DRIVE_FOLDER_ID`.
   - **LANGKAH KRUSIAL**: Klik kanan folder tersebut di Drive ➔ **Bagikan (Share)** ➔ Masukkan alamat email Service Account yang Anda peroleh pada langkah 5 (`...iam.gserviceaccount.com`) ➔ Berikan hak akses sebagai **Editor** ➔ Hilangkan centang "Beri tahu orang lain" ➔ Klik **Kirim / Bagikan**.

---

## 📧 Langkah 4: Setup Resend untuk Email Notifikasi (Untuk Fitur Pendaftaran)

1. Buka [https://resend.com](https://resend.com) lalu daftar akun gratis.
2. Di sidebar dashboard Resend, buka menu **API Keys**.
3. Klik **"Create API Key"**:
   - Berikan nama key (misal: `rumah-amal-dev`).
   - Permission: **Full access** (atau Sending access).
   - Klik **Add**.
4. Salin API Key yang muncul (berawalan `re_...`) ke `RESEND_API_KEY`.
5. Untuk pengetesan lokal tanpa custom domain, Anda bisa memakai default pengirim:
   `EMAIL_FROM="onboarding@resend.dev"` (hanya bisa kirim ke email yang didaftarkan di akun Resend).
   Jika sudah punya domain resmi, verifikasi domain di menu **Domains** di Resend, lalu set `EMAIL_FROM="Rumah Amal USK <noreply@domain-anda.org>"`.

---

## 🌐 Langkah 5: Setup Worker Token & App URL

1. `CRON_SECRET`: Buat string acak sendiri (misal: gabungan 32 huruf dan angka acak) untuk mengamankan endpoint worker:
   Contoh: `CRON_SECRET="rahasia_worker_rumah_amal_2026_xyz123"`
2. `NEXT_PUBLIC_APP_URL`: Untuk pengujian di komputer lokal, isi:
   `NEXT_PUBLIC_APP_URL="http://localhost:3000"`

---

## 📝 Langkah 6: Membuat File `.env`

1. Salin berkas template `.env.example` menjadi `.env`:
   - Di PowerShell:
     ```powershell
     Copy-Item .env.example .env
     ```
   - Atau di Command Prompt:
     ```cmd
     copy .env.example .env
     ```
2. Buka berkas `.env` dan isi setiap nilai variabel sesuai data yang sudah Anda kumpulkan dari Langkah 1 s.d. 5 di atas.

---

## ⚡ Langkah 7: Eksekusi Perintah Awal

Setelah berkas `.env` terisi lengkap, jalankan perintah berikut secara berurutan di terminal project root (`d:\webdev\magang-fix\Rumah-Amal-USK`):

### 1. Pasang Dependensi Node.js
```bash
npm install
```

### 2. Pasang Dependensi Tambahan untuk Fitur Pendaftaran
```bash
npm install googleapis tesseract.js fastest-levenshtein resend
```

### 3. Generate Prisma Client & Dorong Skema ke Database Neon
```bash
npx prisma generate
npx prisma db push
```
*(Perintah `prisma db push` akan membaca schema dari `prisma/schema.prisma` dan otomatis membuat seluruh tabel yang dibutuhkan di database Neon Anda).*

### 4. Jalankan Development Server
```bash
npm run dev
```

Buka browser Anda:
- Website Publik: [http://localhost:3000](http://localhost:3000)
- Dashboard Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (Login dengan email & password yang Anda generate di Langkah 2).
