import * as cheerio from 'cheerio';

export interface LinkPreviewResult {
  url: string;
  title: string;
  image: string | null;
  description: string | null;
  source: string | null;
}

export async function getLinkPreview(url: string): Promise<LinkPreviewResult | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let html: string;
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'id,en;q=0.9',
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) return null;
      html = await res.text();
    } catch {
      clearTimeout(timeoutId);
      return null;
    }

    const $ = cheerio.load(html);

    const ogTitle = $('meta[property="og:title"]').attr('content');
    const twitterTitle = $('meta[name="twitter:title"]').attr('content');
    const pageTitle = $('title').first().text().trim();
    const title = (ogTitle || twitterTitle || pageTitle || '').trim();

    const ogImage = $('meta[property="og:image"]').attr('content');
    const twitterImage = $('meta[name="twitter:image"]').attr('content');
    const image = ogImage || twitterImage || null;

    const ogDesc = $('meta[property="og:description"]').attr('content');
    const metaDesc = $('meta[name="description"]').attr('content');
    const description = (ogDesc || metaDesc || '').trim() || null;

    let source: string | null = null;
    try {
      const hostname = new URL(url).hostname;
      source = hostname.replace(/^www\./, '');
    } catch {
      source = null;
    }

    // Resolve relative image URL
    let resolvedImage = image;
    if (resolvedImage && !resolvedImage.startsWith('http')) {
      try {
        const base = new URL(url);
        resolvedImage = new URL(resolvedImage, base.origin).href;
      } catch {
        resolvedImage = null;
      }
    }

    return {
      url,
      title: title || url,
      image: resolvedImage,
      description,
      source,
    };
  } catch {
    return null;
  }
}
