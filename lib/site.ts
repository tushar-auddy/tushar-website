export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tushar-auddy-journal.savoryloach64.chatgpt.site').replace(/\/$/, '');

export function assetPath(path: string) {
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith(`${basePath}/`) ? `${basePath}${path}` : path;
}
