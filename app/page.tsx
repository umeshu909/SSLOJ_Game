"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/media";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { useTranslation } from 'next-i18next'
import Link from "next/link";

const API_URL = process.env.PUBLIC_INTERNAL_API_URL || 'http://localhost:8055';
const PUBLIC_URL = process.env.NEXT_PUBLIC_PUBLIC_URL || 'http://localhost:8055';


export default function Home() {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [articles, setArticles] = useState<any[]>([]);
  const [latestCharacter, setLatestCharacter] = useState<any | null>(null);
  const [patchNote, setPatchNote] = useState<any | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  const getRoleLabel = (id: number, t: any): string => {
    const keys: Record<number, string> = {
      1: t("roles.Tank"),
      2: t("roles.Guerrier"),
      3: t("roles.Compétence"),
      4: t("roles.Assassin"),
      5: t("roles.Support")
    };
    return t(keys[id]) || keys[id];
  };

  const getTypeLabel = (id: number, t: any): string => {
    const keys: Record<number, string> = {
      1: t("types.Eau"),
      2: t("types.Feu"),
      3: t("types.Vent"),
      4: t("types.Terre"),
      5: t("types.Lumière"),
      6: t("types.Ombre")
    };
    return t(keys[id]) || keys[id];
  };

  const formatStatLabel = (key: string) => {
    const map: Record<string, string> = {
      "hp": t("stat.PV"),
      "atk": t("stat.ATQ"),
      "def": t("stat.DÉF"),
      "speed": t("stat.speedTrunc"),
      "crit": t("stat.critTrunk"),
      "tenacity": t("stat.tenacityTrunk"),
      "GT Crit.": t("stat.GT Crit."),
      "RÉS DGT CC": t("stat.Rés. DGT CC"),
      "Frappe": t("stat.Frappe"),
      "Esquive": t("stat.Esquive"),
      "Vol Vie": t("stat.Vol Vie"),
      "Effet Soin": t("stat.Effet Soin"),
      "Soin Reçu": t("stat.Soin Reçu"),
      "Accélération": t("stat.Accélération"),
      "Dégâts Infligés": t("stat.Dégâts Infligés"),
      "Degats Reduits": t("stat.Dégâts Réduits"),
      "Régénération sur les Attaques": t("stat.Regen Attaques"),
      "Régénération sur les Dégâts": t("stat.Regen Dégâts"),
      "Stars": t("stat.Stars"),
      "Level": t("stat.Level")
    };
    return map[key] || key;
  };
  const handleNext = () => {
    if (startIndex + 2 < articles.length) {
      setStartIndex(startIndex + 2);
    }
  };

  const handlePrev = () => {
    if (startIndex - 2 >= 0) {
      setStartIndex(startIndex - 2);
    }
  };


  function formatPatchNoteContent(patchNote: any): string {
    if (!patchNote?.content) return "";

    let content = patchNote.content;

    // Déséchapper le HTML (lt, gt, nbsp...)
    content = content
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ");

    // Corriger </br> → <br>
    content = content.replace(/<\/br>/gi, "<br>").replace(/<br\/?>/gi, "<br>");

    // Supprimer les balises <color=...> (non HTML standard)
    content = content.replace(/<color=#[0-9A-Fa-f]+>/g, "").replace(/<\/color>/g, "");

    // Mise en forme personnalisée
    content = content.replace(
      /\[(.*?)\]/g,
      (_, inside) => `<strong><font color="yellow">[${inside}]</font></strong>`
    );

    content = content
      .split(/<br\s*\/?>/)
      .map((line) => {
        const clean = line.trim();
        if (/^=(.+)=$/.test(clean)) {
          const inner = clean.replace(/^=(.+)=$/, "$1").trim();
          return `<strong><font color="yellow">${inner}</font></strong>`;
        }
        return line;
      })
      .join("<br>");

    return content;
  }



  useEffect(() => {
    const lang = localStorage.getItem("lang") || "FR";
    fetch("/api/patchnote/latest", {
      headers: {
        "x-db-choice": lang,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erreur HTTP ${res.status} : ${text}`);
        }
        return res.json();
      })
      .then(setPatchNote)
      .catch((err) => console.error("Erreur patchnote :", err));
  }, []);




useEffect(() => {
  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles/latest");
      if (!res.ok) throw new Error("Directus non joignable");
      const data = await res.json();
      setArticles(data.data);
    } catch (err) {
      console.error("Erreur chargement articles :", err);
      setArticles([]); // met un tableau vide
    }
  };
  fetchArticles();
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
              <Link href={`/characters/${latestCharacter.id}`}>
                <div className="flex-1">
                  <h1 className="text-xs uppercase font-medium mb-3 text-white/80">{t("DERNIER PERSONNAGE")}</h1>
                  <div className="flex flex-col md:flex-row items-center gap-6 bg-[#1f1d3a] hover:bg-[#2a2750] transition-colors duration-300 p-6 rounded-lg shadow-lg">


                    <img
                      src={latestCharacter.image}
                      alt={latestCharacter.name}
                      className="w-40 h-auto rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-yellow-400 mb-2">{latestCharacter.name}</h3>
                      <p className="text-white/90 mb-1">
                        {getRoleLabel(latestCharacter.role, t)} / {getTypeLabel(latestCharacter.type, t)}
                      </p>
                      <p className="text-sm text-white/60 mb-4">
                        {t("interface.Sortie")} : {latestCharacter.releaseDate}
                      </p>
                      {latestCharacter.stats && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-white/80">
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
              </Link>

              {/* Colonne droite : previews CN */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-xs uppercase font-medium mb-3 text-white/80">Preview CN</h2>

                {/* On force la même hauteur que le bloc à gauche */}
                <div className="bg-[#1f1d3a] rounded-lg shadow-lg p-6 flex justify-center items-center gap-6 h-full md:min-h-[240px]">

                  <div className="relative w-40 h-fit">
                    <img
                      src="/images/atlas/icon_tujian/K_shun_chuanshuo.png"
                      className="rounded-lg w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-yellow-400 text-sm font-semibold text-center py-1 rounded-b-lg z-10">
                      Shun ND
                    </div>
                  </div>

                  <div className="relative w-40 h-fit">
                    <img
                      src="/images/atlas/icon_tujian/K_xiakaer_nd.png"
                      className="rounded-lg w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-yellow-400 text-sm font-semibold text-center py-1 rounded-b-lg z-10">
                      Wyvern Chagall ND
                    </div>
                  </div>


                </div>
              </div>

            </div>
          </div>
        )}



        <div className="mt-20">

          <div className="flex justify-between items-end mb-3">
            <h2 className="text-xs uppercase font-medium text-white/80">{t("patchnote")}</h2>
            <h2 className="text-xs uppercase font-medium text-white/80">{t("DERNIERS ARTICLES")}</h2>
          </div>


          <div className="grid gap-6 md:grid-cols-3 items-start relative">
            {/* PATCH NOTE */}
            {patchNote?.content && (
              <div className="bg-[#1f1d3a] p-6 rounded-lg shadow-lg flex flex-col h-[375px]">
                <h1 className="text-sm uppercase font-bold mb-3 text-[#80cfff]">📅 {patchNote.date_patch}</h1>
                <h1 className="text-sm uppercase font-bold mb-3 text-white/80">{patchNote.title}</h1>
                <div
                  className="text-sm text-white/90 leading-relaxed overflow-y-auto pr-2"
                  dangerouslySetInnerHTML={{ __html: formatPatchNoteContent(patchNote) }}
                />
              </div>
            )}

            {articles.length > 0 && (
            <>
              {/* ARTICLE 1 */}
              <div className="relative h-[375px]">
                {startIndex > 0 && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 top-0 bottom-0 w-8 bg-black/20 hover:bg-black/40 text-white z-10 flex items-center justify-center rounded-l"
                  >
                    ◀
                  </button>
                )}
                {articles[startIndex] && (
                  <a
                    href={`/articles/${articles[startIndex].id}`}
                    className="bg-[#1f1d3a] p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col h-full"
                  >
                    <div className="rounded-lg mb-3 w-full overflow-hidden" style={{ height: '250px' }}>
                      <img
                        src={`${PUBLIC_URL}/assets/${articles[startIndex].images}`}
                        alt={articles[startIndex].title}
                        className="w-full object-cover object-top"
                      />
                    </div>
                    <h3 className="text-xm font-semibold text-yellow-400 mb-1">{articles[startIndex].title}</h3>
                    <p className="text-sm text-gray-300">
                      Publié le {new Date(articles[startIndex].date_created).toLocaleDateString("fr-FR")}
                    </p>
                  </a>
                )}
              </div>

              {/* ARTICLE 2 */}
              <div className="relative h-[375px]">
                {startIndex + 1 < articles.length && (
                  <>
                    <a
                      href={`/articles/${articles[startIndex + 1].id}`}
                      className="bg-[#1f1d3a] p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex flex-col h-full"
                    >
                      <div className="rounded-lg mb-3 w-full overflow-hidden" style={{ height: '250px' }}>
                        <img
                          src={`${PUBLIC_URL}/assets/${articles[startIndex + 1].images}`}
                          alt={articles[startIndex + 1].title}
                          className="w-full object-cover object-top"
                        />
                      </div>
                      <h3 className="text-xm font-semibold text-yellow-400 mb-1">{articles[startIndex + 1].title}</h3>
                      <p className="text-sm text-gray-300">
                        Publié le {new Date(articles[startIndex + 1].date_created).toLocaleDateString("fr-FR")}
                      </p>
                    </a>

                    {/* Flèche droite */}
                    {startIndex + 2 < articles.length && (
                      <button
                        onClick={handleNext}
                        className="absolute right-0 top-0 bottom-0 w-8 bg-black/20 hover:bg-black/40 text-white z-10 flex items-center justify-center rounded-r"
                      >
                        ▶
                      </button>
                    )}
                  </>
                )}

              </div>
              </>
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
            {t("Rejoindre")}
          </a>
        </div>
      </div>
    </div>
  );
}