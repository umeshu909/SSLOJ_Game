// API handlers basés sur l'approche openDb + x-db-choice
import { NextApiRequest, NextApiResponse } from 'next';
import { openDb } from '@/utils/database';

// /pages/api/abilities/index.ts
export async function abilitiesHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await openDb('common');

    if (req.method === 'POST') {
      const { name, description, category } = req.body;
      await db.run(
        'INSERT OR IGNORE INTO Abilities (name, description, category) VALUES (?, ?, ?)',
        [name, description, category]
      );
      const ability = await db.get('SELECT * FROM Abilities WHERE name = ?', [name]);
      return res.status(200).json(ability);
    }

    const abilities = await db.all('SELECT * FROM Abilities ORDER BY description');
    res.status(200).json(abilities);
  } catch (error) {
    console.error('Erreur /abilities :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export default abilitiesHandler;
