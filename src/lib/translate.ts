/**
 * Converts Western Arabic numerals (0-9) to Eastern Arabic-Indic numerals (٠-٩).
 * Applied to all Arabic-language output for proper typographic rendering.
 */
export function toArabicNumerals(text: string): string {
  if (!text) return text;
  return text.replace(/[0-9]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) + 0x0630)
  );
}

export function fixProperNouns(text: string, targetLang: 'en' | 'ar'): string {
  if (!text) return text;
  let result = text;

  if (targetLang === 'en') {
    // English proper noun & institutional name rules
    result = result.replace(/House of Charity/gi, 'Rumah Amal');
    result = result.replace(/Charity House/gi, 'Rumah Amal');
    result = result.replace(/House of Deeds/gi, 'Rumah Amal');
    result = result.replace(/Deed House/gi, 'Rumah Amal');
    result = result.replace(/Amal House/gi, 'Rumah Amal');
    result = result.replace(/Syiah Kuala University/gi, 'Universitas Syiah Kuala (USK)');
    result = result.replace(/Jamik Mosque/gi, 'Masjid Jamik USK');
  } else if (targetLang === 'ar') {
    // Arabic proper noun & institutional name rules
    // "Rumah Amal" is the official name — do NOT translate it
    result = result.replace(/Charity House/gi, 'Rumah Amal');
    result = result.replace(/House of Charity/gi, 'Rumah Amal');
    result = result.replace(/دار الأعمال/g, 'Rumah Amal');
    result = result.replace(/منزل الأعمال/g, 'Rumah Amal');
    result = result.replace(/بيت الأعمال/g, 'Rumah Amal');
    result = result.replace(/بيت صدقة/g, 'Rumah Amal');
    result = result.replace(/بيت المال \(Rumah Amal\)/g, 'Rumah Amal');
    result = result.replace(/بيت المال/g, 'Rumah Amal');
    result = result.replace(/روماه أمل/g, 'Rumah Amal USK');
    result = result.replace(/جامعة سياه كوالا/g, 'Universitas Syiah Kuala (USK)');
    result = result.replace(/المسجد الجامع/g, 'Masjid Jamik USK');
  }

  return result;
}

/**
 * Extracts special HTML elements that must NOT be translated
 * (custom buttons, banners, images, iframes) and replaces them
 * with unique placeholders. Returns the sanitized text and a
 * map to restore the originals after translation.
 */
function protectHtml(html: string): { protected: string; map: Map<string, string> } {
  const map = new Map<string, string>();
  let counter = 0;
  let result = html;

  // Match elements that must be kept intact:
  // 1. <a data-type="link-button" ...>...</a> (and its wrapper div)
  // 2. <a data-type="download-button" ...>...</a> (and its wrapper div)
  // 3. <div data-type="bank-banner" ...>...</div>
  // 4. <img ... />
  // 5. <iframe ...></iframe>

  const patterns = [
    // div wrapping link-button or download-button (the outer wrapper div)
    /<div[^>]*class="my-4 w-full"[^>]*>[\s\S]*?<\/div>/gi,
    // bank-banner div
    /<div[^>]*data-type="bank-banner"[\s\S]*?<\/div>/gi,
    // standalone link/download buttons without wrapper
    /<a[^>]*data-type="(?:link-button|download-button)"[\s\S]*?<\/a>/gi,
    // images
    /<img[^>]*\/?>/gi,
    // iframes
    /<iframe[\s\S]*?<\/iframe>/gi,
  ];

  for (const pattern of patterns) {
    result = result.replace(pattern, (match) => {
      const placeholder = `%%PROTECTED_${counter++}%%`;
      map.set(placeholder, match);
      return placeholder;
    });
  }

  return { protected: result, map };
}

/**
 * Translates inner text of protected custom buttons while keeping attributes intact
 */
function translateButtonLabelInHtml(html: string, targetLang: 'en' | 'ar'): string {
  if (!html) return html;
  return html.replace(
    /(<a[^>]*data-type="(?:download-button|link-button)"[^>]*>)([\s\S]*?)(<\/a>)/gi,
    (fullMatch, openTag, label, closeTag) => {
      let translatedLabel = label;

      if (targetLang === 'en') {
        translatedLabel = translatedLabel
          .replace(/Pengumuman Final BPRA UKT/gi, 'BPRA UKT Final Announcement')
          .replace(/DOWNLOAD BERKAS \(PDF\)/gi, 'DOWNLOAD FILE (PDF)')
          .replace(/LINK DOWNLOAD BERKAS/gi, 'FILE DOWNLOAD LINK')
          .replace(/Hasil Seleksi Administrasi/gi, 'Administrative Selection Results')
          .replace(/Hasil Seleksi Akhir/gi, 'Final Selection Results')
          .replace(/Hasil Seleksi/gi, 'Selection Results')
          .replace(/Hasil Akhir/gi, 'Final Results')
          .replace(/Syarat & Ketentuan/gi, 'Terms & Conditions')
          .replace(/Syarat dan Ketentuan/gi, 'Terms and Conditions')
          .replace(/Pengumuman/gi, 'Announcement')
          .replace(/Pendaftaran/gi, 'Registration')
          .replace(/Beasiswa/gi, 'Scholarship')
          .replace(/Panduan/gi, 'Guide')
          .replace(/Formulir/gi, 'Form')
          .replace(/Dokumen/gi, 'Document')
          .replace(/Unduh/gi, 'Download')
          .replace(/Download/gi, 'Download')
          .replace(/Berkas/gi, 'File')
          .replace(/Tautan/gi, 'Link');
      } else if (targetLang === 'ar') {
        translatedLabel = translatedLabel
          .replace(/Pengumuman Final BPRA UKT/gi, 'إعلان BPRA UKT النهائي')
          .replace(/DOWNLOAD BERKAS \(PDF\)/gi, 'تحميل الملف (PDF)')
          .replace(/LINK DOWNLOAD BERKAS/gi, 'رابط تحميل الملف')
          .replace(/Hasil Seleksi Administrasi/gi, 'نتائج التصفية الإدارية')
          .replace(/Hasil Seleksi Akhir/gi, 'نتائج الاختيار النهائي')
          .replace(/Hasil Seleksi/gi, 'نتائج الاختيار')
          .replace(/Hasil Akhir/gi, 'النتائج النهائية')
          .replace(/Syarat & Ketentuan/gi, 'الشروط والأحكام')
          .replace(/Syarat dan Ketentuan/gi, 'الشروط والأحكام')
          .replace(/Pengumuman/gi, 'إعلان')
          .replace(/Pendaftaran/gi, 'تسجيل')
          .replace(/Beasiswa/gi, 'منحة دراسية')
          .replace(/Panduan/gi, 'دليل')
          .replace(/Formulir/gi, 'استمارة')
          .replace(/Dokumen/gi, 'وثيقة')
          .replace(/Unduh/gi, 'تحميل')
          .replace(/Download/gi, 'تحميل')
          .replace(/Berkas/gi, 'الملف')
          .replace(/Tautan/gi, 'رابط');
      }

      return `${openTag}${translatedLabel}${closeTag}`;
    }
  );
}

/**
 * Restores placeholders back to their original HTML elements.
 */
function restoreHtml(text: string, map: Map<string, string>, targetLang?: 'en' | 'ar'): string {
  let result = text;
  for (const [placeholder, original] of map.entries()) {
    // Translation APIs sometimes add spaces inside placeholders — normalize
    const escaped = placeholder.replace(/%/g, '%').replace(/_/g, '[_ ]?');
    let restoredMatch = original;
    if (targetLang) {
      restoredMatch = translateButtonLabelInHtml(restoredMatch, targetLang);
    }
    result = result.replace(new RegExp(escaped, 'g'), () => restoredMatch);
  }
  return result;
}

export async function autoTranslate(
  text: string,
  targetLang: 'en' | 'ar',
  sourceLang: string = 'id'
): Promise<string> {
  if (!text || !text.trim()) return text;

  // Protect special HTML elements from translation
  const { protected: safeText, map: protectedMap } = protectHtml(text);

  const apiKey = process.env.DEEPL_API_KEY;

  if (apiKey) {
    try {
      const endpoint = apiKey.endsWith(':fx')
        ? 'https://api-free.deepl.com/v2/translate'
        : 'https://api.deepl.com/v2/translate';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: [safeText],
          target_lang: targetLang.toUpperCase(),
          tag_handling: 'html',
          ignore_tags: ['a', 'img', 'iframe'],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const translated = data.translations?.[0]?.text;
        if (translated) {
          const restored = restoreHtml(translated, protectedMap, targetLang);
          const fixed = fixProperNouns(restored, targetLang);
          return targetLang === 'ar' ? toArabicNumerals(fixed) : fixed;
        }
      } else {
        console.warn(`[DeepL API Warning ${res.status}] Falling back to Google Translate...`);
      }
    } catch (error) {
      console.error('DeepL translation error, falling back to Google:', error);
    }
  }

  // Fallback to Google Translate if DeepL is unavailable
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        safeText
      )}`
    );

    if (!res.ok) return text;

    const data = await res.json();
    let translated = safeText;
    if (Array.isArray(data) && Array.isArray(data[0])) {
      translated = data[0].map((item: any) => item[0] || '').join('');
    }

    const restored = restoreHtml(translated, protectedMap, targetLang);
    const fixed = fixProperNouns(restored, targetLang);
    return targetLang === 'ar' ? toArabicNumerals(fixed) : fixed;
  } catch (error) {
    console.error('Google Translation error:', error);
    return text;
  }
}

export async function autoTranslateAll(data: {
  title?: string;
  excerpt?: string;
  content?: string;
}) {
  const { title = '', excerpt = '', content = '' } = data;

  const [
    titleEn,
    titleAr,
    excerptEn,
    excerptAr,
    contentEn,
    contentAr,
  ] = await Promise.all([
    title ? autoTranslate(title, 'en') : Promise.resolve(''),
    title ? autoTranslate(title, 'ar') : Promise.resolve(''),
    excerpt ? autoTranslate(excerpt, 'en') : Promise.resolve(''),
    excerpt ? autoTranslate(excerpt, 'ar') : Promise.resolve(''),
    content ? autoTranslate(content, 'en') : Promise.resolve(''),
    content ? autoTranslate(content, 'ar') : Promise.resolve(''),
  ]);

  return {
    titleEn,
    titleAr,
    excerptEn,
    excerptAr,
    contentEn,
    contentAr,
  };
}

