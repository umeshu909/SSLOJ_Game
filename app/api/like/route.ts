// app/api/like/route.ts

const ipLikeCache = new Map<string, Set<string>>(); // Map<articleId, Set<ip>>

export async function POST(req: Request) {
  const { id, likes } = await req.json();
  const API_URL = process.env.PUBLIC_INTERNAL_API_URL || 'http://localhost:8055';

  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  // Initialiser le cache pour cet article
  if (!ipLikeCache.has(id)) ipLikeCache.set(id, new Set());
  const ipSet = ipLikeCache.get(id)!;

  // Si l'IP a déjà liké cet article, bloquer
  if (ipSet.has(ip)) {
    return new Response(JSON.stringify({ error: 'Vous avez déjà liké cet article.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Ajouter l'IP au cache et auto-expirer après 24h (optionnel)
  ipSet.add(ip);
  setTimeout(() => ipSet.delete(ip), 24 * 60 * 60 * 1000); // 24h

  // Envoyer la mise à jour à Directus
  const res = await fetch(`${API_URL}/items/Articles/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes }),
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
