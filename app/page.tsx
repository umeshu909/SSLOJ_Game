"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/media";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { useTranslation } from 'next-i18next'
import Link from "next/link";
import he from 'he';

const API_URL = process.env.PUBLIC_INTERNAL_API_URL || 'http://localhost:8055';
const PUBLIC_URL = process.env.NEXT_PUBLIC_PUBLIC_URL || 'http://localhost:8055';


export default function Home() {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [latestCharacter, setLatestCharacter] = useState<any | null>(null);
  const [patchNote, setPatchNote] = useState<any | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [articles, setArticles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(9); // nombre d’articles par page
  const [totalPages, setTotalPages] = useState(1);


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

  function cleanText(html: string): string {
    const noHtml = html.replace(/<[^>]*>/g, '');
    return he.decode(noHtml);
  }

  function getExcerpt(text: string, wordLimit = 50): string {
    const words = text.split(/\s+/);
    return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
  }

  function formatDate(dateStr?: string): string {
    if (!dateStr) return "Date inconnue";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

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


  const fetchArticles = async () => {
    try {
      const res = await fetch(`/api/articles/latest?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Directus non joignable");
      const data = await res.json();
      setArticles(data.data);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      console.error("Erreur chargement articles :", err);
      setArticles([]);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page]);



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
  <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white py-5 px-4 sm:px-10">
    <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-10">

      {/* === INFOS : patch note, dernier perso, preview CN — À DROITE en desktop === */}
      <div className="w-full lg:w-[380px] flex flex-col gap-3 order-1 lg:order-2">
        

        {/* === WRAPPER MOBILE : Dernier personnage + Preview CN === */}
        <div className="flex flex-col gap-3">

          {/* === MOBILE : Dernier personnage + Preview CN dans une seule ligne de 3 colonnes === */}
          <div className="lg:hidden bg-[#1f1d3a] p-4 rounded-lg shadow-lg mt-5">
            <h1 className="text-xs uppercase font-medium mb-3 text-white/80">
              {t("DERNIER PERSONNAGE")} + Preview CN
            </h1>

            <div className="grid grid-cols-3 gap-2 items-start">
              
              {/* Colonne 1 : image dernier perso */}
              <div className="relative">
                {latestCharacter && (
                  <Link href={`/characters/${latestCharacter.id}`}>
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={latestCharacter.image}
                        alt={latestCharacter.name}
                        className="w-full h-auto mb-1 hover:bg-[#29264a] shadow-lg  hover:-translate-y-1 transition-transform duration-300"
                      />
                      <div className="absolute bottom-1 left-0 right-0 bg-black/60 text-center py-0.5 z-10">
                        <div className="text-[11px] text-yellow-400 font-semibold">{latestCharacter.name}</div>
                        <div className="text-[10px] text-white/80">
                          {getRoleLabel(latestCharacter.role, t)} / {getTypeLabel(latestCharacter.type, t)}
                        </div>
                        <div className="text-[10px] text-white/50">
                          {t("interface.Sortie")} : {latestCharacter.releaseDate}
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>


              {/* Colonne 2 : preview Kagaho */}
              <div className="relative">
                <img
                  src="/images/atlas/icon_tujian/K_huihuo_tianbao.png"
                  className="rounded w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-yellow-400 text-[10px] text-center py-0.5 rounded-b z-10">
                  Bennu Kagaho (LC)
                </div>
              </div>

            </div>
          </div>


          {/* Desktop uniquement : DERNIER PERSONNAGE */}
          {latestCharacter && (
            <Link href={`/characters/${latestCharacter.id}`}>
              <div className="hidden lg:block bg-[#1f1d3a] p-4 rounded-lg shadow-lg hover:bg-[#2a2750] transition-colors duration-300 mt-6">
                <h1 className="text-xs uppercase font-medium mb-3 text-white/80">{t("DERNIER PERSONNAGE")}</h1>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img src={latestCharacter.image} alt={latestCharacter.name} className="w-30 h-auto rounded" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-1">{latestCharacter.name}</h3>
                    <p className="text-white/90 text-sm mb-1">
                      {getRoleLabel(latestCharacter.role, t)} / {getTypeLabel(latestCharacter.type, t)}
                    </p>
                    <p className="text-sm text-white/60 mb-2">
                      {t("interface.Sortie")} : {latestCharacter.releaseDate}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Desktop uniquement : PREVIEW CN */}
          <div className="hidden lg:block bg-[#1f1d3a] rounded-lg shadow-lg p-4">
            <h2 className="text-xs uppercase font-medium mb-3 text-white/80">Preview CN</h2>
            <div className="flex justify-center items-center gap-4">
              <div className="relative w-30">
                <img src="/images/atlas/icon_tujian/K_huihuo_tianbao.png" className="rounded-lg w-full h-auto" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-yellow-400 text-xs text-center py-1 rounded-b-lg z-10">
                  Bennu Kagaho
                </div>
              </div>
            </div>
          </div>
        </div>





        {/* PATCH NOTE */}
        {patchNote?.content && (
          <div className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg">
            <h1 className="text-sm uppercase font-bold mb-2 text-[#80cfff]">📅 {patchNote.date_patch}</h1>
            <h1 className="text-sm uppercase font-bold mb-3 text-white/80">{patchNote.title}</h1>
            <div
              className="text-sm text-white/90 leading-relaxed overflow-y-auto max-h-[260px] pr-1"
              dangerouslySetInnerHTML={{ __html: formatPatchNoteContent(patchNote) }}
            />
          </div>
        )}



      </div>

      {/* === ARTICLES — À GAUCHE en desktop === */}
      <div className="flex-1 order-2 lg:order-1">
        <a href="/articles">
        <h2 className="text-xs uppercase font-medium text-white/80 mb-3">{t("DERNIERS ARTICLES")}</h2>
        </a>
        <div className="grid gap-6 md:grid-cols-3 items-start">
          {articles.map((article) => {
            const imageUrl = article.images ? `${PUBLIC_URL}/assets/${article.images}` : null;

            return (
              <a
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="bg-[#1f1d3a] hover:bg-[#29264a] rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Image */}
                {imageUrl && (
                  <div className="w-full h-[250px] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover object-[center_20%] transform transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}

                {/* Contenu */}
                <div className="flex flex-col flex-1 p-5 text-white">
                  <h2 className="text-base font-semibold text-yellow-400 mb-1">{article.title}</h2>

                  <div className="text-left text-xs text-gray-500">
                    Le {formatDate(article.date_created)} par {article.user_created?.first_name || "Inconnu"} ✨
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed flex-1 mt-5">
                    {getExcerpt(cleanText(article.text), 30)}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-30`}
          >
            ← 
          </button>
          <span className="text-sm">
            {t("Page")} {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-30`}
          >
             →
          </button>
        </div>


      </div>
    </div>

  </div>
);



}