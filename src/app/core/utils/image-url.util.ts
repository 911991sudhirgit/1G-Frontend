/**
 * Extract Google Drive file ID from share/view links.
 * Supports: .../file/d/FILE_ID/view... and ...?id=FILE_ID (open link)
 */
function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();
  if (!u) return null;
  const fileMatch = u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const openMatch = u.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (openMatch) return openMatch[1];
  return null;
}

/**
 * Convert Google Drive file view/share link to a direct image URL so <img> can load it.
 * As of 2024, uc?export=view often returns 403. The thumbnail API works for public files:
 * https://drive.google.com/thumbnail?id=FILE_ID&sz=w1200
 */
export function toDirectImageUrl(url: string | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const u = url.trim();
  if (!u) return '';
  const fileId = extractGoogleDriveFileId(u);
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
  }
  return u;
}

/**
 * Resolve a property image URL for display: converts Drive view links to direct URLs,
 * and prepends baseUrl for relative paths.
 */
export function resolvePropertyImageUrl(url: string | undefined, baseUrl?: string): string {
  const direct = toDirectImageUrl(url);
  if (!direct) return '';
  if (direct.startsWith('http://') || direct.startsWith('https://')) return direct;
  const base = (baseUrl || '').replace(/\/$/, '');
  return base ? (direct.startsWith('/') ? base + direct : base + '/' + direct) : direct;
}
