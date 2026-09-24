import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Kredensial admin dibaca dari environment variable, bukan dari database.
// ADMIN_EMAIL dan ADMIN_PASSWORD_HASH harus diset di .env

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('[DEBUG-AUTH] email atau password kosong dari form');
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          console.error('[DEBUG-AUTH] env var kosong -> ADMIN_EMAIL:', !!adminEmail, 'ADMIN_PASSWORD_HASH:', !!adminPasswordHash);
          return null;
        }

        // DEBUG SEMENTARA: jangan biarkan ini ke-commit permanen, ini expose
        // sebagian info sensitif ke log. Hapus lagi setelah masalah ketemu.
        console.error('[DEBUG-AUTH] panjang ADMIN_PASSWORD_HASH:', adminPasswordHash.length, 'prefix:', adminPasswordHash.slice(0, 7));
        console.error('[DEBUG-AUTH] email dari form === ADMIN_EMAIL ?', credentials.email === adminEmail);

        // Cek email cocok
        if (credentials.email !== adminEmail) {
          console.error('[DEBUG-AUTH] GAGAL di pengecekan email. Form:', JSON.stringify(credentials.email), 'Env:', JSON.stringify(adminEmail));
          return null;
        }

        // Verifikasi password dengan bcrypt hash
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          adminPasswordHash
        );

        if (!isPasswordValid) {
          console.error('[DEBUG-AUTH] GAGAL di bcrypt.compare -> hash tidak cocok dengan password yang diketik');
          return null;
        }

        console.error('[DEBUG-AUTH] SUKSES, lolos semua pengecekan');

        return {
          id: 'admin',
          email: adminEmail,
          name: 'Admin',
          role: 'admin',
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      // Hanya izinkan akses jika sesi valid (sudah login sebagai admin)
      return !!auth?.user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60, // Sesi akan otomatis kadaluarsa dalam 2 jam
  },
});