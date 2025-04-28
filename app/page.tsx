"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/media";

const PUBLIC_URL = process.env.NEXT_PUBLIC_PUBLIC_URL || 'http://localhost:8055';

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
      .then((data) => {
        setArticles(data); // ← assume que la structure est { data: [...] }
      })
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
            <div className="flex flex-col md:flex-row gap-6">
              {/* Colonne gauche : dernier perso */}
              <div className="flex-1">
                <h1 className="text-xs uppercase font-medium mb-3 text-white/80">Dernier personnage</h1>
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

              {/* Colonne droite : previews CN */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-xs uppercase font-medium mb-3 text-white/80">Preview CN</h2>

                {/* On force la même hauteur que le bloc à gauche */}
                <div className="bg-[#1f1d3a] rounded-lg shadow-lg p-6 flex justify-center items-center gap-6 h-full md:min-h-[240px]">

                  <div className="relative w-40 h-fit">
                    <img
                      src="/images/actual/K_panduola_nd.png"
                      className="rounded-lg w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-yellow-400 text-sm font-semibold text-center py-1 rounded-b-lg z-10">
                      Pandore ND
                    </div>
                  </div>


                </div>
              </div>

            </div>
          </div>
        )}



        {/* Derniers articles */}
        <div className="mt-20">
          <h2 className="text-xs uppercase font-medium mb-3 text-white/80">Derniers articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {Array.isArray(articles) && articles.length > 0 ? (
              articles.slice(0, 3).map((article) => (
                <a
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 block"
                >
                  {article.images && (
                    <img
                      src={`${PUBLIC_URL}/assets/${article.images}`}
                      alt={article.title}
                      className="rounded-lg mb-3 w-full"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-yellow-400 mb-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-300">
                    Publié le {new Date(article.date_created).toLocaleDateString("fr-FR")}
                  </p>
                </a>
              ))
            ) : (
              <p className="text-white/60">Aucun article disponible.</p>
            )}
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