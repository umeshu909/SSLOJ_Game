"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/media"; // ✅ Import ajouté

type Article = {
  id: string;
  title: string;
  slug: string;
  thumbnail?: {
    url?: string;
  };
  publishedDate: string;
};

export default function Home() {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch("/api/articles/latest")
      .then((res) => res.json())
      .then(setArticles)
      .catch((err) => console.error("Erreur chargement articles :", err));
  }, []);

  const setDbChoice = (dbChoice: string, id: number, categId: string) => {
    fetch("/api/set-db-choice", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `dbChoice=${dbChoice}`,
    })
      .then(() => {
        router.push(`/characters/${id}?dbChoice=${dbChoice}&categId=${categId}`);
      })
      .catch((error) =>
        console.error("Erreur lors de la mise à jour de la session :", error)
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white py-12 px-4 sm:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Last Releases */}
        <h1 className="text-3xl font-bold mb-8 text-center">Last Releases</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-yellow-400">Chinese Version</h3>
            <button onClick={() => setDbChoice("CN", 55311, "stats")}>
              <img
                src="/images/actual/CN.jpg"
                alt="CN"
                className="rounded-lg mt-2 mb-2"
              />
            </button>
            <p>12.03.2025</p>
          </div>
          <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-yellow-400">Global Version</h3>
            <button onClick={() => setDbChoice("FR", 15202, "stats")}>
              <img
                src="/images/actual/GLO.jpg"
                alt="GL"
                className="rounded-lg mt-2 mb-2"
              />
            </button>
            <p>17.04.2025</p>
          </div>
          <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-yellow-400">Japanese Version</h3>
            <button onClick={() => setDbChoice("JP", 55305, "stats")}>
              <img
                src="/images/actual/JP.jpg"
                alt="JP"
                className="rounded-lg mt-2 mb-2"
              />
            </button>
            <p>09.04.2025</p>
          </div>
        </div>

        {/* Preview CN */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-6">Preview CN</h2>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center w-fit">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                Pandore ND
              </h3>
              <img
                src="/images/actual/K_panduola_nd.png"
                alt="Preview"
                className="rounded-lg"
              />
            </div>
            <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center w-fit">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                Shiryu semi-naked
              </h3>
              <img
                src="/images/actual/K_zilong_chuancheng.png"
                alt="Preview"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Derniers articles */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-6">Derniers articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <a
                key={article.id}
                href={`/articles/${article.slug}`}
                className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 block"
              >
                {article.thumbnail?.url && (
                  <img
                    src={getMediaUrl(article.thumbnail.url)} // ✅ URL corrigée ici
                    alt={article.title}
                    className="rounded-lg mb-3 w-full"
                  />
                )}
                <h3 className="text-lg font-semibold text-yellow-400 mb-1">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-300">
                  Publié le{" "}
                  {new Date(article.publishedDate).toLocaleDateString("fr-FR")}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Discord */}
        <div className="flex flex-col items-center justify-center rounded-lg shadow-lg p-6 text-center mt-20">
          <h3 className="text-lg font-semibold text-white mb-4">
            Join us on Discord
          </h3>
          <a
            href="https://discord.gg/enGQVj9WvJ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full transition"
          >
            {/* logo discord ici */}
            Rejoindre
          </a>
        </div>
      </div>
    </div>
  );
}