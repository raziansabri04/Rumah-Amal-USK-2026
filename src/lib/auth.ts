import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import prisma from '@/lib/prisma';

// Kredensial admin dibaca dari tabel database `Admin`.
// Menggunakan fallback auto-seed dari .env jika tabel Admin belum terisi.

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).trim();
        const password = credentials.password as string;

        try {
          let admin = await (prisma as any).admin?.findUnique({
            where: { email },
          });

          // Fallback auto-seed jika tabel Admin masih kosong dan env diset
          if (!admin && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH) {
            if (email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
              const isEnvPasswordValid = await bcrypt.compare(
                password,
                process.env.ADMIN_PASSWORD_HASH
              );
              if (isEnvPasswordValid) {
                try {
                  admin = await (prisma as any).admin.create({
                    data: {
                      email: process.env.ADMIN_EMAIL,
                      passwordHash: process.env.ADMIN_PASSWORD_HASH,
                      name: 'Super Admin',
                      role: 'SUPER_ADMIN',
                    },
                  });
                } catch {
                  return {
                    id: 'admin-default',
                    email: process.env.ADMIN_EMAIL,
                    name: 'Super Admin',
                    role: 'SUPER_ADMIN',
                  };
                }
              }
            }
          }

          if (!admin) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name || 'Admin',
            role: admin.role || 'SUPER_ADMIN',
          };
        } catch (err) {
          console.error('[Admin Auth Error]', err);
          return null;
        }
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