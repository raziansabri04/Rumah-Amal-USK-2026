// Script untuk generate bcrypt hash dari password admin
// Jalankan: node scripts/generate-hash.js <password_anda>
// Contoh: node scripts/generate-hash.js admin123

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.error('Usage: node scripts/generate-hash.js <password>');
    process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

// Escape $ menjadi \$ agar Next.js tidak menginterpretasikan sebagai variabel env
// Lihat: https://nextjs.org/docs/app/guides/environment-variables#referencing-other-variables
const escapedHash = hash.replace(/\$/g, '\\$');

// Verifikasi hash langsung (gunakan hash asli, bukan yang sudah di-escape)
const isValid = bcrypt.compareSync(password, hash);

console.log('\n=== Salin ke .env ===');
console.log(`ADMIN_EMAIL="rumahamal@usk.ac.id"`);
console.log(`ADMIN_PASSWORD_HASH="${escapedHash}"`);
console.log('=====================');
console.log(`✓ Hash verified: ${isValid ? 'OK' : 'GAGAL!'}`);
console.log('');
console.log('Catatan: Tanda \\$ adalah escape untuk Next.js .env');
console.log('         Jangan hapus backslash tersebut.\n');
