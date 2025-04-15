import { NextResponse } from "next/server";
import { openDb } from "@/utils/database";
import { replacePlaceholders } from "@/utils/replacePlaceholders";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, dbChoice } = body;

    // Récupération depuis l’en-tête si non présent dans le body
    const lang =
      dbChoice ||
      req.headers.get("x-db-choice")?.toUpperCase() || // en-tête HTTP
      "FR"; // fallback par défaut

    if (!text) {
      return NextResponse.json(
        { error: "Champ 'text' requis" },
        { status: 400 }
      );
    }

    const db = await openDb(lang);
    const replaced = await replacePlaceholders(text, db);

    return NextResponse.json({ result: replaced });
  } catch (err) {
    console.error("Erreur dans l'API /skills/parse:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
