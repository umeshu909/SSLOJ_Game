import type { NextApiRequest, NextApiResponse } from 'next'

const CMS_URL = process.env.CMS_URL || 'http://localhost:3000'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${CMS_URL}/api/articles?limit=3&sort=-publishedDate&where[published][equals]=true`)
    const data = await response.json()
    res.status(200).json(data.docs)
  } catch (err) {
    console.error('Erreur fetch articles :', err)
    res.status(500).json({ error: 'Impossible de charger les articles' })
  }
}