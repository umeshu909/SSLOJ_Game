// app/api/patchnote/latest/route.ts
import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'databases', 'DB_COMMON.sqlite');
    const db = await open({ filename: dbPath, driver: sqlite3.Database });

    const data = await db.get(
      `SELECT * FROM PatchNotes WHERE language = 'fr' ORDER BY id DESC LIMIT 1`
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
