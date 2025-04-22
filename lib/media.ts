export function getMediaUrl(path?: string): string {
    const base = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'
    return path ? `${base}${path}` : ''
  }