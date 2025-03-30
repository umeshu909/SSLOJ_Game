import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const directoryPath = path.join(process.cwd(), "public/images/Texture2D/");
        const files = fs.readdirSync(directoryPath);
        const pngFiles = files.filter(file => file.endsWith(".png"));
        return NextResponse.json({ images: pngFiles });
    } catch (error) {
        console.error("Erreur lors de la lecture du répertoire :", error);
        return NextResponse.json({ error: "Erreur lors de la récupération des images" }, { status: 500 });
    }
}
