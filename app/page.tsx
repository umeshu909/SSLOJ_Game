"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/media";

const roleMapping: Record<number, string> = {
  1: "Tank",
  2: "Guerrier",
  3: "Compétence",
  4: "Assassin",
  5: "Support",
};

const typeMapping: Record<number, string> = {
  1: "Eau",
  2: "Feu",
  3: "Vent",
  4: "Terre",
  5: "Lumière",
  6: "Ombre",
};

const formatStatLabel = (key: string) => {
  const map: Record<string, string> = {
    PV: "PV",
    ATQ: "ATQ",
    DÉF: "DÉF",
    "Vitesse ATQ": "Vitesse ATQ",
    "Taux Crit.": "Taux Crit.",
    "Taux Tenacité": "Tenacité",
    "GT Crit.": "GT Crit.",
    "RÉS DGT CC": "Rés. DGT CC",
    Frappe: "Frappe",
    Esquive: "Esquive",
    "Vol Vie": "Vol Vie",
    "Effet Soin": "Effet Soin",
    "Soin Reçu": "Soin Reçu",
    Accélération: "Accélération",
    "Dégâts Infligés": "Dégâts Infligés",
    "Degats Reduits": "Dégâts Réduits",
    "Régénération sur les Attaques": "Regen Attaques",
    "Régénération sur les Dégâts": "Regen Dégâts",
    Stars: "Étoiles",
    Level: "Niveau"
  };
  return map[key] || key;
};

export default function Home() {
  const router = useRouter();

  const [articles, setArticles] = useState<any[]>([]);
  const [latestCharacter, setLatestCharacter] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/articles/latest")
      .then((res) => res.json())
      .then(setArticles)
      .catch((err) => console.error("Erreur chargement articles :", err));
  }, []);

  useEffect(() => {
    fetch("/api/characters/latest", {
      headers: {
        "x-db-choice": localStorage.getItem("lang") || "FR",
      },
    })
      .then((res) => res.json())
      .then(setLatestCharacter)
      .catch((err) => console.error("Erreur chargement perso récent :", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white py-12 px-4 sm:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Dernier personnage */}
        {latestCharacter && (
          <div className="mb-20">
            <h1 className="text-3xl font-bold mb-8 text-center">Dernier personnage</h1>
            <div className="flex flex-col md:flex-row items-center gap-6 bg-[#1f1d3a] p-6 rounded-lg shadow-lg">
              <img
                src={latestCharacter.image}
                alt={latestCharacter.name}
                className="w-40 h-auto rounded"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-yellow-400 mb-2">{latestCharacter.name}</h3>
                <p className="text-white/90 mb-1">
                  {roleMapping[latestCharacter.role]} / {typeMapping[latestCharacter.type]}
                </p>
                <p className="text-sm text-white/60 mb-4">
                  Sortie : {latestCharacter.releaseDate}
                </p>
                {latestCharacter.stats && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-white/80">
                    {Object.entries(latestCharacter.stats)
                      .filter(([_, value]) => {
                        if (typeof value === "string") return value !== "0%" && value !== "0";
                        return Number(value) > 0;
                      })
                      .map(([key, value]) => (
                        <div key={key} className="bg-[#29264a] p-2 rounded">
                          {formatStatLabel(key)} : {String(value)}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preview CN */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-6">Preview CN</h2>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center w-fit">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Pandore ND</h3>
              <img src="/images/actual/K_panduola_nd.png" alt="Preview" className="rounded-lg" />
            </div>
            <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg text-center w-fit">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Shiryu semi-naked</h3>
              <img src="/images/actual/K_zilong_chuancheng.png" alt="Preview" className="rounded-lg" />
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
                    src={getMediaUrl(article.thumbnail.url)}
                    alt={article.title}
                    className="rounded-lg mb-3 w-full"
                  />
                )}
                <h3 className="text-lg font-semibold text-yellow-400 mb-1">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-300">
                  Publié le {new Date(article.publishedDate).toLocaleDateString("fr-FR")}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Discord */}
        <div className="flex flex-col items-center justify-center rounded-lg shadow-lg p-6 text-center mt-20">
          <h3 className="text-lg font-semibold text-white mb-4">Join us on Discord</h3>
          <a
            href="https://discord.gg/enGQVj9WvJ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full transition"
          >
            Rejoindre
          </a>
        </div>
      </div>
    </div>
  );
}