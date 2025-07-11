import type { NextApiRequest, NextApiResponse } from 'next'

// L'URL de ton serveur Directus (adapter si besoin pour la prod)
const CMS_URL = process.env.CMS_URL || 'http://localhost:8055'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${CMS_URL}/items/Articles?fields=id,title,text,date_created,images,status&sort=-date_created&limit=10&filter[status][_eq]=published`);
    const data = await response.json();
    res.status(200).json({ data: data.data })

  } catch (err) {
    console.error('Erreur fetch articles :', err)
    res.status(500).json({ error: 'Impossible de charger les articles' })
  }
}
