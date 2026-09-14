import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from './message-gateway';
import { normalizePhoneNumber, maskPhoneNumber } from './phone-utils';

const OTP_EXPIRATION_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 3;

/**
 * Generate a cryptographically secure 6-digit numeric OTP.
 */
export function generateNumericOtp(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
}

/**
 * Hash the OTP using sha256 with a secret salt.
 */
export function hashOtp(otp: string, nip: string): string {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'rumah-amal-otp-salt';
  return crypto
    .createHash('sha256')
    .update(`${otp}:${nip}:${secret}`)
    .digest('hex');
}

export interface RequestOtpResult {
  success: boolean;
  maskedPhone: string;
  channel: 'whatsapp';
  cooldownSeconds: number;
}

/**
 * Create and send OTP to the donor's registered phone number via WhatsApp.
 */
export async function createAndSendOtp(
  nip: string,
  rawPhone: string,
  channel: 'whatsapp' = 'whatsapp'
): Promise<RequestOtpResult> {
  const cleanNip = nip.trim();
  const normalizedPhone = normalizePhoneNumber(rawPhone);
  const maskedPhone = maskPhoneNumber(rawPhone);

  if (!normalizedPhone || normalizedPhone.length < 8) {
    throw new Error('Nomor HP tidak valid.');
  }

  // Check rate limit: cooldown between requests
  const recentOtp = await prisma.otpVerification.findFirst({
    where: {
      nip: cleanNip,
      createdAt: {
        gte: new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000),
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (recentOtp) {
    const elapsedSeconds = Math.floor((Date.now() - recentOtp.createdAt.getTime()) / 1000);
    const remainingCooldown = Math.max(1, RESEND_COOLDOWN_SECONDS - elapsedSeconds);
    throw new Error(
      `Mohon tunggu ${remainingCooldown} detik sebelum meminta kode OTP baru.`
    );
  }

  // Generate new OTP
  const otpCode = generateNumericOtp(6);
  const otpHash = hashOtp(otpCode, cleanNip);
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

  // Save to database
  await prisma.otpVerification.create({
    data: {
      nip: cleanNip,
      channel,
      otpHash,
      phoneTarget: maskedPhone,
      expiresAt,
      maxAttempts: MAX_ATTEMPTS,
    },
  });

  // Prepare message template
  const message =
    `Assalamu'alaikum Wr. Wb.\n\n` +
    `Kode OTP untuk verifikasi riwayat Zakat & Infaq Rumah Amal USK Anda adalah:\n\n` +
    `*${otpCode}*\n\n` +
    `Kode ini berlaku selama ${OTP_EXPIRATION_MINUTES} menit. Demi keamanan data Anda, JANGAN berikan kode ini kepada siapapun.\n\n` +
    `Terima kasih.\n_Rumah Amal Masjid Jamik USK_`;

  // Send via WhatsApp
  await sendWhatsAppMessage(normalizedPhone, message);

  return {
    success: true,
    maskedPhone,
    channel,
    cooldownSeconds: RESEND_COOLDOWN_SECONDS,
  };
}

/**
 * Verify the user-provided OTP code for the given NIP.
 */
export async function verifyOtp(nip: string, inputOtp: string): Promise<boolean> {
  const cleanNip = nip.trim();
  const cleanOtp = inputOtp.trim();

  if (!cleanOtp || cleanOtp.length !== 6) {
    throw new Error('Kode OTP harus terdiri dari 6 digit angka.');
  }

  // Find latest active OTP record
  const latestOtp = await prisma.otpVerification.findFirst({
    where: {
      nip: cleanNip,
      verified: false,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!latestOtp) {
    throw new Error('Tidak ditemukan permintaan OTP yang aktif. Silakan kirim kode OTP terlebih dahulu.');
  }

  // Check if expired
  if (new Date() > latestOtp.expiresAt) {
    throw new Error('Kode OTP telah kedaluwarsa. Silakan minta kode OTP baru.');
  }

  // Check maximum failed attempts
  if (latestOtp.attempts >= latestOtp.maxAttempts) {
    throw new Error('Batas percobaan verifikasi telah habis. Silakan kirim ulang kode OTP.');
  }

  // Verify hash
  const expectedHash = hashOtp(cleanOtp, cleanNip);
  const isValid = expectedHash === latestOtp.otpHash;

  if (!isValid) {
    const updatedAttempts = latestOtp.attempts + 1;
    await prisma.otpVerification.update({
      where: { id: latestOtp.id },
      data: { attempts: updatedAttempts },
    });

    const remaining = latestOtp.maxAttempts - updatedAttempts;
    if (remaining <= 0) {
      throw new Error('Kode OTP salah. Batas percobaan telah habis. Silakan kirim kode baru.');
    }
    throw new Error(`Kode OTP salah. Sisa kesempatan mencoba: ${remaining} kali.`);
  }

  // Mark as verified
  await prisma.otpVerification.update({
    where: { id: latestOtp.id },
    data: { verified: true },
  });

  return true;
}
