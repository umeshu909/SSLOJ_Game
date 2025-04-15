import { NextResponse } from "next/server";
import { openDb } from "@/utils/database";
import { replacePlaceholders } from "@/utils/replacePlaceholders";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headerLang = req.headers.get("x-db-choice")?.toUpperCase();
    const text = body.text;

    // Priorité : header > body > fallback
    const dbChoice = headerLang || body.dbChoice || "FR";

    if (!text) {
      return NextResponse.json(
        { error: "Champ 'text' requis" },
        { status: 400 }
      );
    }

    const db = await openDb(dbChoice);
    const replaced = await replacePlaceholders(text, db);

    return NextResponse.json({ result: replaced });
  } catch (err) {
    console.error("Erreur dans l'API /skills/parse:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
