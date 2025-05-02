'use client';

import { useEffect, useState } from 'react';

export default function LikeButton({ articleId, initialLikes }: { articleId: string; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // évite le rendu côté serveur

  async function handleLike() {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL || 'http://localhost:8055'}/items/Articles/${articleId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        likes: likes + 1,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setLikes(data.likes ?? likes + 1);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="mt-6 px-4 py-2 bg-blue-600 hover:bg-pink-700 text-white rounded shadow cursor-pointer disabled:cursor-not-allowed"
    >
      ❤️ {likes} {likes === 1 ? 'like' : 'likes'}
    </button>
  );
}
