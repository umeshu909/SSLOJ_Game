// lib/getAbsoluteMediaUrl.ts

export function getAbsoluteMediaUrl(url: string): string {
    const CMS_URL = process.env.CMS_URL || "http://localhost:3000"
  
    // Si l'URL commence déjà par http(s), on la retourne telle quelle
    if (url.startsWith("http")) return url
  
    // Sinon on la complète avec le CMS_URL
    return `${CMS_URL}${url}`
  }