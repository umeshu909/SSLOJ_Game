import { NextResponse } from "next/server";
import { openDb } from "@/utils/database";
import { replacePlaceholders } from "@/utils/replacePlaceholders";

export async function POST(req: Request) {
  const body = await req.json();
  const db = await openDb("FR");

  const replaced = await replacePlaceholders(body.text, db);

  return NextResponse.json({ result: replaced });
}