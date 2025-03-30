// utils/loadJson.ts

import path from "path";
import fs from "fs/promises";

export async function loadJson(file: string) {
  try {
    const filePath = path.join(process.cwd(), "public/data", file);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Erreur lors du chargement de:", file, error);
    return null;
  }
}
