const MAX_WIDTH = 1600;
const QUALITY = 0.85;
export const RESIZE_THRESHOLD = 1_000_000; // 1 MB

export function resizeImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;
            if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas tidak didukung'));
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error(`Gagal konversi ${file.name} ke WebP`));
                },
                'image/webp',
                QUALITY
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error(`Gagal memuat gambar: ${file.name}`));
        };

        img.src = url;
    });
}