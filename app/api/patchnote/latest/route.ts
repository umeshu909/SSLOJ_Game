// app/api/patchnote/latest/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const lang = (req.headers.get('x-db-choice') || 'FR').toUpperCase();

    // Cartographie personnalisée pour les langues
    const mapping: Record<string, string> = {
      FR: 'fr',
      EN: 'en',
      ES: 'es',
      BR: 'br',  // portugais brésilien
      IT: 'ita',
      JP: 'jp',
      CN: 'en'   // CN redirige vers anglais
    };
    const patchLang = mapping[lang] ?? 'en';

    const dbPath = path.join(process.cwd(), 'databases', 'DB_COMMON.sqlite');
    const db = await open({ filename: dbPath, driver: sqlite3.Database });

    const data = await db.get(
      `SELECT * FROM PatchNotes WHERE language = ? ORDER BY id DESC LIMIT 1`,
      [patchLang]
    );

    return NextResponse.json(data || {});
  } catch (error) {
    console.error("Erreur dans /api/patchnote/latest :", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
