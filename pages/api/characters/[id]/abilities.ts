// API handlers basés sur l'approche openDb + x-db-choice
import { NextApiRequest, NextApiResponse } from 'next';
import { openDb } from '@/utils/database';


// /pages/api/characters/[id]/abilities.ts
export async function characterAbilitiesHandler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const db = await openDb('common');
    const characterId = parseInt(req.query.id as string);

    if (req.method === 'GET') {
      const links = await db.all('SELECT ability_id FROM CharacterAbilities WHERE character_id = ?', [characterId]);
      return res.status(200).json(links.map(l => l.ability_id));
    }

    if (req.method === 'POST') {
      const { abilityId } = req.body;
      await db.run('INSERT OR IGNORE INTO CharacterAbilities (character_id, ability_id) VALUES (?, ?)', [characterId, abilityId]);
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { abilityId } = req.body;
      await db.run('DELETE FROM CharacterAbilities WHERE character_id = ? AND ability_id = ?', [characterId, abilityId]);
      return res.status(200).json({ success: true });
    }

    res.status(405).end();
  } catch (error) {
    console.error('Erreur /characters/[id]/abilities :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

export default characterAbilitiesHandler;
