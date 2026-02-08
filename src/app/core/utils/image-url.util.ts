/**
 * Convert Google Drive file view/share link to a direct image URL so <img> can load it.
 * View links like https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
 * must be converted to https://drive.google.com/uc?export=view&id=FILE_ID
 */
export function toDirectImageUrl(url: string | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const u = url.trim();
  if (!u) return '';
  const m = u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
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
