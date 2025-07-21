// pages/api/articles/latest.ts

import type { NextApiRequest, NextApiResponse } from 'next'

const CMS_URL = process.env.CMS_URL || 'http://localhost:8055'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 9;
  const offset = (page - 1) * limit;

  try {
    const response = await fetch(`${CMS_URL}/items/Articles?fields=id,title,text,date_created,images,user_created.first_name,status&sort=-date_created&limit=${limit}&offset=${offset}&filter[status][_eq]=published&meta=filter_count`);
    const data = await response.json();

    const total = data.meta?.filter_count || 0;

    res.status(200).json({
      data: data.data,
      total,
      page,
      limit
    });
  } catch (err) {
    console.error('Erreur fetch articles :', err);
    res.status(500).json({ error: 'Impossible de charger les articles' });
  }
}

