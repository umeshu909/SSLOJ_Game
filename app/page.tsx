"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/media";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { useTranslation } from 'next-i18next'

const API_URL = process.env.PUBLIC_INTERNAL_API_URL || 'http://localhost:8055';
const PUBLIC_URL = process.env.NEXT_PUBLIC_PUBLIC_URL || 'http://localhost:8055';


export default function Home() {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [articles, setArticles] = useState<any[]>([]);
  const [latestCharacter, setLatestCharacter] = useState<any | null>(null);
  const [patchNote, setPatchNote] = useState<any | null>(null);

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
      "PV": t("stat.PV"),
      "ATQ": t("stat.ATQ"),
      "DÉF": t("stat.DÉF"),
      "Vitesse ATQ": t("stat.Vitesse ATQ"),
      "Taux Crit.": t("stat.Taux Crit."),
      "Taux Tenacité": t("stat.Tenacité"),
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
    fetch("/api/articles/latest")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.data); // attention, avec Directus il faut aller dans `data.data`
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
                <h1 className="text-xs uppercase font-medium mb-3 text-white/80">{t("DERNIER PERSONNAGE")}</h1>
                <div className="flex flex-col md:flex-row items-center gap-6 bg-[#1f1d3a] p-6 rounded-lg shadow-lg">
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
                      src="/images/atlas/icon_tujian/K_binghe_ndbainiao.png"
                      className="rounded-lg w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-yellow-400 text-sm font-semibold text-center py-1 rounded-b-lg z-10">
                      Hyôga ND
                    </div>
                  </div>

                  <div className="relative w-40 h-fit">
                    <img
                      src="/images/atlas/icon_tujian/K_shun_chuanshuo.png"
                      className="rounded-lg w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-yellow-400 text-sm font-semibold text-center py-1 rounded-b-lg z-10">
                      Shun ND
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}



        {/* Derniers articles */}
        <div className="mt-20">
          <h2 className="text-xs uppercase font-medium mb-3 text-white/80">{t("DERNIERS ARTICLES")}</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {Array.isArray(articles) && articles.length > 0 ? (
              articles.slice(0, 3).map((article) => (
                <a
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 block"
                >
                  <div className="rounded-lg mb-3 w-full overflow-hidden" style={{ height: '300px' }}>
                    <img
                      src={`${PUBLIC_URL}/assets/${article.images}`}
                      alt={article.title}
                      className="w-full object-cover object-top"
                      style={{ height: '300px' }}
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-yellow-400 mb-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-300">
                    Publié le {new Date(article.date_created).toLocaleDateString("fr-FR")}
                  </p>
                </a>
              ))
            ) : (
              <p className="text-white/60">{t("errors.Aucun article disponible")}</p>
            )}


            {/* PatchNote */}
            {patchNote?.content && (
              <div className="mt-0 bg-[#1f1d3a] p-6 rounded-lg shadow-lg min-h-[450px] flex flex-col">
                <h1 className="text-sm uppercase font-bold mb-3 text-[#80cfff]">📅 {patchNote.date_patch}</h1>
                <h1 className="text-sm uppercase font-bold mb-3 text-white/80">
                  {patchNote.title}
                </h1>
                <div
                  className="text-sm text-white/90 leading-relaxed max-h-[300px] overflow-y-auto pr-2"
                  dangerouslySetInnerHTML={{ __html: formatPatchNoteContent(patchNote) }}
                />
              </div>
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