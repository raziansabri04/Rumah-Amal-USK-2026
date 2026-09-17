import { Resend } from 'resend';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.includes('ganti-dengan') || apiKey.includes('re_123456789')) {
    return null;
  }
  return new Resend(apiKey);
}

/**
 * Mengirim email notifikasi perbaikan dokumen ke pendaftar
 */
export async function sendCorrectionEmail({
  toEmail,
  applicantName,
  programName,
  token,
  warnings,
}: {
  toEmail: string;
  applicantName: string;
  programName: string;
  token: string;
  warnings: { fieldLabel: string; message: string }[];
}) {
  const resend = getResendClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const correctionUrl = `${baseUrl}/perbaiki/${token}`;
  const fromEmail = process.env.EMAIL_FROM || 'Rumah Amal USK <onboarding@resend.dev>';

  // Jika Resend belum dikonfigurasi, simpan log simulasi
  if (!resend || !toEmail) {
    console.log(`[SIMULASI EMAIL NOTIFIKASI PERBAIKAN DOKUMEN]`);
    console.log(`Ke: ${toEmail || 'Email tidak terisi di biodata'}`);
    console.log(`Nama: ${applicantName}`);
    console.log(`Program: ${programName}`);
    console.log(`Link Perbaikan: ${correctionUrl}`);
    console.log(`Daftar Berkas Bermasalah:`, warnings);
    return { success: true, simulated: true };
  }

  try {
    const warningListHtml = warnings
      .map(
        (w) => `
      <li style="margin-bottom: 8px;">
        <strong>${w.fieldLabel}</strong>: ${w.message}
      </li>
    `
      )
      .join('');

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; color: #1f2937;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0b6330; margin: 0;">Rumah Amal USK</h2>
          <p style="font-size: 13px; color: #6b7280; margin-top: 4px;">Pemberitahuan Hasil Verifikasi Berkas Pendaftaran</p>
        </div>

        <p>Assalamu'alaikum Wr. Wb. <strong>${applicantName}</strong>,</p>

        <p style="line-height: 1.6; font-size: 14px;">
          Terima kasih telah mendaftar pada program <strong>${programName}</strong>. Sistem verifikasi otomatis kami telah memeriksa kelengkapan berkas yang Anda unggah.
        </p>

        <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">⚠️ Berkas yang Perlu Diperbaiki / Dilengkapi:</h4>
          <ul style="font-size: 13px; color: #78350f; margin: 0; padding-left: 20px;">
            ${warningListHtml}
          </ul>
        </div>

        <p style="font-size: 14px; line-height: 1.6;">
          Anda <strong>tidak perlu mengisi ulang seluruh data diri</strong>. Cukup buka link di bawah ini dan unggah kembali dokumen yang bermasalah:
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${correctionUrl}" style="background-color: #0b6330; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
            Buka Halaman Perbaikan Dokumen
          </a>
        </div>

        <p style="font-size: 12px; color: #6b7280; line-height: 1.5;">
          Token Pendaftaran Anda: <code style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${token}</code><br/>
          Jika tombol di atas tidak dapat diklik, salin tautan berikut ke peramban web Anda:<br/>
          <a href="${correctionUrl}" style="color: #0b6330;">${correctionUrl}</a>
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
          Email ini dikirim secara otomatis oleh Sistem Pendaftaran Rumah Amal Masjid Jamik USK Banda Aceh.
        </p>
      </div>
    `;

    const data = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `[Tindakan Diperlukan] Perbaikan Berkas Pendaftaran - ${programName}`,
      html: htmlContent,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error('[Gagal kirim email via Resend]', error);
    return { success: false, error: error.message };
  }
}
