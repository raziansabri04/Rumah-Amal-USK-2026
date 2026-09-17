import { google } from 'googleapis';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

/**
 * Inisialisasi Google Drive Client menggunakan Service Account
 */
function getGoogleDriveClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !privateKey) {
    return null;
  }

  // Handle escape karakter new line pada private key
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'],
    });

    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('[Google Drive Auth Error]', error);
    return null;
  }
}

/**
 * Mencari atau membuat folder di Google Drive
 */
async function getOrCreateFolder(
  drive: any,
  folderName: string,
  parentFolderId?: string
): Promise<string> {
  const queryParts = [
    `mimeType = 'application/vnd.google-apps.folder'`,
    `name = '${folderName.replace(/'/g, "\\'")}'`,
    'trashed = false',
  ];

  if (parentFolderId) {
    queryParts.push(`'${parentFolderId}' in parents`);
  }

  const res = await drive.files.list({
    q: queryParts.join(' and '),
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id!;
  }

  // Jika belum ada, buat folder baru
  const folderMetadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    folderMetadata.parents = [parentFolderId];
  }

  const created: any = await drive.files.create({
    requestBody: folderMetadata,
    fields: 'id',
  });

  return created.data.id!;
}

export interface UploadResult {
  fileId: string;
  fileUrl: string;
  isMock: boolean;
}

/**
 * Upload buffer file ke Google Drive (atau fallback folder lokal uploads jika SA belum diset)
 */
export async function uploadFileToDrive({
  buffer,
  originalFilename,
  mimeType,
  programName,
  applicantFolderTag,
}: {
  buffer: Buffer;
  originalFilename: string;
  mimeType: string;
  programName: string;
  applicantFolderTag: string;
}): Promise<UploadResult> {
  const drive: any = getGoogleDriveClient();
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  // Fallback lokal jika Google Drive credentials belum terkonfigurasi
  if (!drive || !rootFolderId) {
    const localDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'pendaftaran',
      programName.replace(/[^a-zA-Z0-9]/g, '_'),
      applicantFolderTag.replace(/[^a-zA-Z0-9]/g, '_')
    );
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    const safeFilename = `${Date.now()}_${originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(localDir, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const relativePath = `/uploads/pendaftaran/${programName.replace(/[^a-zA-Z0-9]/g, '_')}/${applicantFolderTag.replace(/[^a-zA-Z0-9]/g, '_')}/${safeFilename}`;
    return {
      fileId: `local_${Date.now()}`,
      fileUrl: relativePath,
      isMock: true,
    };
  }

  try {
    // 1. Dapatkan atau buat folder program di dalam root folder
    const programFolderId = await getOrCreateFolder(drive, programName, rootFolderId);

    // 2. Dapatkan atau buat folder pendaftar di dalam folder program
    const applicantFolderId = await getOrCreateFolder(drive, applicantFolderTag, programFolderId);

    // 3. Upload file ke folder pendaftar
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const fileMetadata = {
      name: originalFilename,
      parents: [applicantFolderId],
    };

    const media = {
      mimeType: mimeType || 'application/octet-stream',
      body: stream,
    };

    const uploaded: any = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = uploaded.data.id!;
    const fileUrl = uploaded.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

    return {
      fileId,
      fileUrl,
      isMock: false,
    };
  } catch (error: any) {
    console.error('[uploadFileToDrive error]', error);
    throw new Error(`Gagal mengunggah berkas ke Google Drive: ${error.message}`);
  }
}

/**
 * Mengunduh file buffer dari Google Drive atau path lokal (mock)
 */
export async function downloadFileBuffer(fileUrl: string, driveFileId?: string | null): Promise<Buffer> {
  // Jika file disimpan di lokal (mock)
  if (fileUrl.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), 'public', fileUrl);
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
    throw new Error(`File lokal tidak ditemukan: ${localPath}`);
  }

  const drive: any = getGoogleDriveClient();
  if (!drive || !driveFileId || driveFileId.startsWith('local_')) {
    throw new Error(`Tidak dapat mengunduh berkas drive: kredensial tidak tersedia atau ID lokal (${driveFileId})`);
  }

  const res = await drive.files.get(
    { fileId: driveFileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );

  return Buffer.from(res.data);
}

/**
 * Mengunggah file PDF hasil penggabungan (merge) ke folder pendaftar
 */
export async function uploadMergedPdfToDrive({
  buffer,
  filename,
  programName,
  applicantFolderTag,
}: {
  buffer: Buffer;
  filename: string;
  programName: string;
  applicantFolderTag: string;
}): Promise<UploadResult> {
  return uploadFileToDrive({
    buffer,
    originalFilename: filename,
    mimeType: 'application/pdf',
    programName,
    applicantFolderTag,
  });
}

