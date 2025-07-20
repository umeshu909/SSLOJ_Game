import { NextRequest } from "next/server";
import sharp from "sharp";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get("src");

  if (!src) {
    return new Response("Missing src parameter", { status: 400 });
  }

  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error("Image fetch failed");

    const buffer = await res.arrayBuffer();
    const image = await sharp(Buffer.from(buffer))
      .resize({ width: 1600 })
      .sharpen(1.2, 0.8, 1.0)
      .toBuffer();

    return new Response(image, {
      headers: {
        "Content-Type": "image/jpeg", // ou png selon tes besoins
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    console.error(err);
    return new Response("Image processing failed", { status: 500 });
  }
}
