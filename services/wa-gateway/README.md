# WhatsApp Gateway Self-Hosted (Rumah Amal USK)

Gateway mandiri berbasis **Baileys (WhatsApp Multi-Device Protocol)** untuk mengirimkan pesan kode OTP verifikasi donatur secara otomatis tanpa biaya langganan pihak ketiga (**100% Gratis / Rp 0**).

Service ini berjalan sebagai **background process** di sisi server dan berintegrasi langsung dengan **Admin Dashboard** website Rumah Amal USK (`/admin/whatsapp`). Admin tidak perlu membuka port 3001 secara manual — semua pengelolaan QR Code, status koneksi, dan uji coba pesan dilakukan dari dalam halaman admin.

---

## 🚀 Cara Menjalankan

1. Masuk ke folder gateway:
   ```bash
   cd services/wa-gateway
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Jalankan service di background:
   ```bash
   npm start
   ```

4. **Scan QR Code melalui Halaman Admin Dashboard**:
   - Pastikan aplikasi Next.js juga sudah berjalan (`npm run dev` di root proyek).
   - Buka browser dan login sebagai admin: **`http://localhost:3000/admin`**
   - Klik menu **"WhatsApp Gateway"** di sidebar admin.
   - QR Code akan tampil langsung di halaman tersebut.
   - Buka WhatsApp di smartphone nomor resmi Rumah Amal USK ➔ **Perangkat Tertaut** ➔ **Tautkan Perangkat** ➔ Scan QR Code.
   - Status di halaman admin akan langsung berubah menjadi **🟢 ONLINE & TERHUBUNG**.

> **Catatan**: Service ini hanya perlu berjalan di background.

---

## 🌟 Fitur yang Tersedia di Halaman Admin (`/admin/whatsapp`):
1. **Live QR Code Display**: QR Code tampil secara visual di dashboard admin (tidak perlu melihat terminal).
2. **Indikator Status Real-time**: Memantau apakah nomor WhatsApp sedang *ONLINE & TERHUBUNG*, *Menunggu Scan QR*, atau *Gateway Offline*.
3. **Form Uji Coba Kirim Pesan**: Admin dapat langsung menguji kirim pesan WhatsApp ke nomor HP manapun.
4. **Tombol Putuskan Sesi (Logout)**: Memudahkan jika admin ingin mengganti nomor WhatsApp resmi yang terhubung.

---

## ⚙️ Konfigurasi di Web Utama Next.js (`.env`)

Pastikan baris berikut sudah ada di file `.env` root proyek Next.js:

```env
WA_SELF_HOSTED_URL="http://localhost:3001"
```

---

## 🖥️ Menjalankan Bersamaan (Development)

Untuk menjalankan keduanya sekaligus, buka dua jendela terminal:

- **Terminal 1** (root proyek): `npm run dev`
- **Terminal 2** (folder gateway): `npm start`

Untuk produksi/server, gunakan **PM2** agar kedua service berjalan otomatis:

```bash
pm2 start ecosystem.config.js
```
