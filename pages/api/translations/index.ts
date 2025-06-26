import { promises as fs } from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const getJsonPath = (locale: string) => path.join(process.cwd(), 'locales', locale, 'common.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const locale = req.query.locale as string;
    if (!locale) return res.status(400).json({ error: 'Missing locale' });

    try {
      const filePath = getJsonPath(locale);
      const content = await fs.readFile(filePath, 'utf-8');
      return res.status(200).json(JSON.parse(content));
    } catch (err) {
      return res.status(500).json({ error: 'Erreur lecture fichier' });
    }
  }

  if (req.method === 'POST') {
    const { key, fr, en } = req.body;
    if (!key || fr == null || en == null) return res.status(400).json({ error: 'Champs manquants' });

    const [frPath, enPath] = [getJsonPath('fr'), getJsonPath('en')];

    try {
      const frData = JSON.parse(await fs.readFile(frPath, 'utf-8'));
      const enData = JSON.parse(await fs.readFile(enPath, 'utf-8'));

      // Support nested keys like "interface.searchCharacter"
      const setNestedValue = (obj: any, keyPath: string, value: string) => {
        const keys = keyPath.split('.');
        let current = obj;
        keys.forEach((k, idx) => {
          if (idx === keys.length - 1) current[k] = value;
          else current[k] = current[k] || {};
          current = current[k];
        });
      };

      setNestedValue(frData, key, fr);
      setNestedValue(enData, key, en);

      await fs.writeFile(frPath, JSON.stringify(frData, null, 2), 'utf-8');
      await fs.writeFile(enPath, JSON.stringify(enData, null, 2), 'utf-8');

      return res.status(200).json({ message: 'Traduction enregistrée avec succès.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur mise à jour des fichiers' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
