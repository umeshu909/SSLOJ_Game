// API handlers basés sur l'approche openDb + x-db-choice
import { NextApiRequest, NextApiResponse } from 'next';
import { openDb } from '@/utils/database';

// /pages/api/characters/list.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const db = await openDb('common');
    const characters = await db.all('SELECT id, name, firstname FROM releases ORDER BY name');
    res.status(200).json(characters);
  } catch (error) {
    console.error('Erreur /characters :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}