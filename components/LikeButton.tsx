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
    try {
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: articleId, likes: likes + 1 }),
      });


      const data = await res.json();

      if (res.ok && data?.data?.likes !== undefined) {
        setLikes(data.data.likes);
      } else {
        console.error("Erreur mise à jour :", res.status, data);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    } finally {
      setLoading(false);
    }
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
