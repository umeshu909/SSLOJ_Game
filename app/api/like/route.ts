// app/api/like/route.ts
export async function POST(req: Request) {
  const { id, likes } = await req.json();
  const API_URL = process.env.PUBLIC_INTERNAL_API_URL || 'http://localhost:8055';

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
