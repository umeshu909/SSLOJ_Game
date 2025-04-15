import { NextResponse } from "next/server";
import { openDb } from "@/utils/database";

export async function POST(req: Request) {
  try {
    const { skillid, level, lang = "FR" } = await req.json();

    if (!skillid || !level) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const db = await openDb(lang);
    const row = await db.get(
      "SELECT desc FROM SkillTextConfig WHERE skillid = ? AND level = ?",
      [skillid, level]
    );

    return NextResponse.json({ result: row?.desc || "" });
  } catch (err) {
    console.error("Erreur API /skills/text:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
