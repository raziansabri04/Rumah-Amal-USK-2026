const express = require('express');
const cors = require('cors');
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const AUTH_FOLDER = path.join(__dirname, 'session_auth');

app.use(cors());
app.use(express.json());

let sock = null;
let connectionStatus = 'disconnected'; // 'disconnected' | 'connecting' | 'connected'
let currentQRImage = null; // Base64 Data URL
let connectedUser = null;

async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state,
    generateHighQualityLinkPreview: false,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      connectionStatus = 'connecting';
      try {
        currentQRImage = await QRCode.toDataURL(qr, {
          width: 320,
          margin: 2,
          color: {
            dark: '#074722',
            light: '#FFFFFF',
          },
        });
      } catch (err) {
        console.error('Error generating QR data URL:', err);
      }

      console.log('[WA Gateway] 🔄 QR Code baru telah di-generate. Silakan scan di Web Admin.');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      connectionStatus = 'disconnected';
      currentQRImage = null;
      connectedUser = null;
      console.log(`[WA Gateway] Koneksi terputus (Status: ${statusCode}). Reconnecting: ${shouldReconnect}`);

      if (shouldReconnect) {
        setTimeout(startWhatsApp, 3000);
      } else {
        console.log('[WA Gateway] Sesi telah di-logout. Membuka QR baru di Web Admin...');
        cleanSessionFolder();
        setTimeout(startWhatsApp, 2000);
      }
    } else if (connection === 'open') {
      connectionStatus = 'connected';
      currentQRImage = null;
      connectedUser = sock?.user?.id ? sock.user.id.split(':')[0] : 'Aktif';
      console.log(`[WA Gateway] ✅ WHATSAPP RUMAH AMAL BERHASIL TERHUBUNG! (Nomor: ${connectedUser})`);
    }
  });
}

function cleanSessionFolder() {
  try {
    if (fs.existsSync(AUTH_FOLDER)) {
      fs.rmSync(AUTH_FOLDER, { recursive: true, force: true });
    }
  } catch (err) {
    console.error('Gagal membersihkan session folder:', err);
  }
}

// 1. Endpoint JSON status untuk Web Dashboard
app.get('/status', (req, res) => {
  res.json({
    status: connectionStatus,
    qrImage: currentQRImage,
    connectedUser: connectedUser,
    timestamp: new Date().toISOString(),
  });
});

// 2. Endpoint Kirim Pesan OTP untuk Next.js Backend
app.post('/send-message', async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ success: false, error: 'Nomor HP dan Pesan wajib diisi.' });
    }

    if (connectionStatus !== 'connected' || !sock) {
      return res.status(503).json({
        success: false,
        error: 'WhatsApp Gateway belum terhubung. Silakan scan QR code terlebih dahulu di dashboard admin.',
      });
    }

    let cleanPhone = phone.replace(/[^\d]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    const jid = `${cleanPhone}@s.whatsapp.net`;

    const result = await sock.sendMessage(jid, { text: message });

    console.log(`[WA Gateway] Pesan berhasil dikirim ke ${cleanPhone}`);
    return res.json({ success: true, messageId: result.key.id });
  } catch (error) {
    console.error('[WA Gateway Error]:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Endpoint Logout / Putuskan Sesi
app.post('/logout', async (req, res) => {
  try {
    if (sock) {
      await sock.logout();
    }
    cleanSessionFolder();
    connectionStatus = 'disconnected';
    currentQRImage = null;
    connectedUser = null;
    setTimeout(startWhatsApp, 1500);
    return res.json({ success: true, message: 'Sesi WhatsApp berhasil diputuskan. Membuka QR baru...' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 [WA Gateway Service] Berjalan di port ${PORT}`);
  console.log(`======================================================\n`);
  startWhatsApp();
});
