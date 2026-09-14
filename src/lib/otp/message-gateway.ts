/**
 * Message Gateway for sending OTP via WhatsApp.
 * Supports Self-Hosted WhatsApp Gateway (Baileys/WPPConnect), Fonnte, and Dev/Console Mock fallback.
 */

export interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendWhatsAppMessage(toPhone: string, message: string): Promise<SendMessageResult> {
  const normalizedPhone = toPhone.replace(/[^\d]/g, '');

  // 1. Check if Self-Hosted WhatsApp Gateway is configured or default to localhost:3001
  const selfHostedUrl = process.env.WA_SELF_HOSTED_URL || 'http://localhost:3001';
  const selfHostedKey = process.env.WA_SELF_HOSTED_KEY || '';

  try {
    const res = await fetch(`${selfHostedUrl.replace(/\/$/, '')}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(selfHostedKey ? { Authorization: `Bearer ${selfHostedKey}` } : {}),
      },
      body: JSON.stringify({
        phone: normalizedPhone,
        message,
      }),
    });

    const json = await res.json().catch(() => null);

    if (res.ok && json?.success) {
      console.log(`[WhatsApp Gateway] ✅ OTP berhasil dikirim via WA ke +${normalizedPhone}`);
      return { success: true, messageId: json.messageId || 'wa-self-hosted' };
    }

    if (json?.error) {
      console.error('[WhatsApp Gateway Error]:', json.error);
      throw new Error(`Gagal mengirim WhatsApp: ${json.error}`);
    }
  } catch (err: any) {
    console.error('[WhatsApp Gateway Fetch Error]:', err.message);

    // 2. Check if Fonnte WhatsApp API is configured as backup
    const fonnteToken = process.env.FONNTE_API_TOKEN;
    if (fonnteToken) {
      try {
        const resFonnte = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
            Authorization: fonnteToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            target: normalizedPhone,
            message,
          }),
        });

        if (resFonnte.ok) {
          const jsonFonnte = await resFonnte.json();
          if (jsonFonnte.status) {
            return { success: true, messageId: jsonFonnte.id || 'fonnte' };
          }
        }
      } catch (fErr: any) {
        console.error('[WhatsApp Gateway Error - Fonnte]:', fErr.message);
      }
    }

    // 3. Fallback: Dev/Mock Console Logger if gateway is offline in development
    if (process.env.NODE_ENV === 'development') {
      console.log('\n======================================================');
      console.log('📱 [WHATSAPP OTP GATEWAY - DEV MOCK (GATEWAY OFFLINE)]');
      console.log(`To      : +${normalizedPhone}`);
      console.log(`Content :\n${message}`);
      console.log('======================================================\n');
      return { success: true, messageId: 'mock-wa-id' };
    }

    throw new Error('Layanan WhatsApp Gateway sedang tidak tersedia. Silakan hubungi admin Rumah Amal USK.');
  }

  return { success: true, messageId: 'wa-sent' };
}
