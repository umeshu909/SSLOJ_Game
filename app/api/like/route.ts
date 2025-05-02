// app/api/like/route.ts
export async function POST(req: Request) {
  const { id, likes } = await req.json();

  const res = await fetch(`http://localhost:8055/items/Articles/${id}`, {
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
