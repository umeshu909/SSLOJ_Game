"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import IconCanvas from "@/components/IconCanvas";
import { getImageSrc, loadIcons } from "@/utils/iconLoader";

interface LinkEntry {
  FetterID: number;
  HeroName: string;
  mainIcon: string;
  Hero1Icon: string | null;
  Hero2Icon: string | null;
  Hero3Icon: string | null;
  Hero4Icon: string | null;
  skillLevel: number;
  skillDescription: string;
}

interface LinkGroup {
  fetterId: number;
  heroName: string;
  mainIcon: string;
  companions: string[];
  skills: {
    level: number;
    description: string;
  }[];
}

export default function CharacterLinks() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [links, setLinks] = useState<LinkGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prefix = "sactx-0-4096x2048-ASTC 6x6-icon_touxiang-";
  const jsonDir = "/images/atlas/icon_touxiang/";
  const imgHeight = 2048;

  useEffect(() => {
    async function preloadAtlas() {
      try {
        const imageSrc = await getImageSrc(prefix);
        if (!imageSrc) return;

        const imageName = imageSrc.split("/").pop() || "";
        const baseName = imageName.replace(".png", "");
        const jsonPath = `${jsonDir}${baseName}.json`;

        const res = await fetch(jsonPath);
        const contentType = res.headers.get("Content-Type");
        if (!res.ok || !contentType?.includes("application/json")) {
          console.warn("❌ JSON introuvable ou invalide:", jsonPath);
          return;
        }

        const atlasJson = await res.json();
        await loadIcons(imageSrc, jsonDir, 2, imgHeight);
      } catch (error) {
        console.error("Erreur lors du chargement de l’atlas:", error);
      }
    }

    preloadAtlas();
  }, []);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const lang = localStorage.getItem("lang") || "FR";
        const res = await fetch(`/api/characters/${id}/links`,
        {
          headers: {
            "x-db-choice": lang,
          },
        });
        
        if (!res.ok) throw new Error("Erreur lors du chargement des liens");
        const data: LinkEntry[] = await res.json();

        const grouped: Record<number, LinkGroup> = {};
        data.forEach(entry => {
          if (!grouped[entry.FetterID]) {
            grouped[entry.FetterID] = {
              fetterId: entry.FetterID,
              heroName: entry.HeroName,
              mainIcon: entry.mainIcon,
              companions: [
                entry.Hero1Icon,
                entry.Hero2Icon,
                entry.Hero3Icon,
                entry.Hero4Icon,
              ].filter(Boolean) as string[],
              skills: [],
            };
          }
          grouped[entry.FetterID].skills.push({
            level: entry.skillLevel,
            description: entry.skillDescription,
          });
        });

        setLinks(Object.values(grouped));
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchLinks();
  }, [id]);

  if (loading) return <p className="text-white">Chargement des liens...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (links.length === 0) return <p>Aucun lien trouvé.</p>;

  return (
    <section className="lg:p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">Liens</h2>

      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="border border-white/20 rounded-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Colonne de gauche avec icônes */}
              <div className="p-4 bg-white/5 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center justify-center w-full md:w-[160px] gap-2">
                <div className="p-[2px] rounded-full border-2 border-yellow-400 ">
                  <IconCanvas
                    prefix={prefix}
                    iconName={link.mainIcon}
                    jsonDir={jsonDir}
                    canvasId={`main-canvas-${index}`}
                    imgHeight={imgHeight}
                    size={1.5}
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {link.companions.map((icon, idx) => (
                    <IconCanvas
                      key={idx}
                      prefix={prefix}
                      iconName={icon}
                      jsonDir={jsonDir}
                      canvasId={`companion-${index}-${idx}`}
                      imgHeight={imgHeight}
                      size={2}
                    />
                  ))}
                </div>
              </div>

              {/* Détails du lien */}
              <div className="flex-1 p-6 space-y-3">
                <div className="space-y-1 text-sm text-white">
                  {link.skills.map((skill, idx) => (
                    <p key={idx}>
                      <span className="font-semibold">Niv {skill.level} :</span>{" "}
                      {skill.description}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}