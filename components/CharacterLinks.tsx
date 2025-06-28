"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import IconCanvas from "@/components/IconCanvas";
import { getImageSrc, loadIcons } from "@/utils/iconLoader";
import Description from "@/components/Description";
import { useTranslation } from 'next-i18next'

interface LinkEntry {
  FetterID: number;
  HeroID: number;
  HeroName: string;
  mainIcon: string;
  Hero1Id: number | null;
  Hero1Icon: string | null;
  Hero2Id: number | null;
  Hero2Icon: string | null;
  Hero3Id: number | null;
  Hero3Icon: string | null;
  Hero4Id: number | null;
  Hero4Icon: string | null;
  skillLevel: number;
  skillDescription: string;
}

interface LinkGroup {
  fetterId: number;
  HeroID: number;
  heroName: string;
  mainIcon: string;
  companions: { id: number; icon: string }[];
  skills: {
    level: number;
    description: string;
    skillid: number;
  }[];
}


export default function CharacterLinks() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [links, setLinks] = useState<LinkGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<string | null>(null);
  const { t } = useTranslation("common");

  const prefix = "sactx-0-4096x2048-ASTC 6x6-icon_touxiang-";
  const jsonDir = "/images/atlas/icon_touxiang/";
  const imgHeight = 2048;

  useEffect(() => {
      const storedLang = localStorage.getItem("lang") || "FR";
      setLang(storedLang);
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
        
        if (!res.ok) throw new Error(t("errors.noLinks"));
        const data: LinkEntry[] = await res.json();

        const grouped: Record<number, LinkGroup> = {};
        data.forEach(entry => {
          if (!grouped[entry.FetterID]) {
            grouped[entry.FetterID] = {
              fetterId: entry.FetterID,
              HeroID: entry.HeroID,
              heroName: entry.HeroName,
              mainIcon: entry.mainIcon,
              companions: [
                { id: entry.Hero1Id, icon: entry.Hero1Icon },
                { id: entry.Hero2Id, icon: entry.Hero2Icon },
                { id: entry.Hero3Id, icon: entry.Hero3Icon },
                { id: entry.Hero4Id, icon: entry.Hero4Icon },
              ].filter(c => c.id && c.icon) as { id: number; icon: string }[],

              skills: [],
            };
          }
          grouped[entry.FetterID].skills.push({
            skillid: entry.skillid,
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

  if (loading) return <p className="text-white">{t("interface.loading")}</p>;
  if (error) return <div className="text-center"><h2 className="text-xl font-semibold">{error}</h2></div>
  if (links.length === 0) return <p>{t("errors.noLinks")}</p>;

  return (
    <section className="lg:px-6">
      <h2 className="text-xl font-semibold text-white mb-2">{t("interface.links")}</h2>

      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="border border-white/20 rounded-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Colonne de gauche avec icônes */}
              <div className="p-4 bg-white/5 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center justify-center w-full md:w-[160px] gap-2">
                <div className="p-[2px] rounded-full border-2 border-yellow-400 ">
                  <a href={`/characters/${link.HeroID}`} key={index}>
                    <IconCanvas
                      prefix={prefix}
                      iconName={link.mainIcon}
                      jsonDir={jsonDir}
                      canvasId={`main-canvas-${index}`}
                      imgHeight={imgHeight}
                      size={1.5}
                    />
                  </a>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {link.companions.map((companion, idx) => (
                    <a href={`/characters/${companion.id}`} key={idx}>
                      <IconCanvas
                        prefix={prefix}
                        iconName={companion.icon}
                        jsonDir={jsonDir}
                        canvasId={`companion-${index}-${idx}`}
                        imgHeight={imgHeight}
                        size={2}
                      />
                    </a>
                  ))}

                </div>
              </div>

              {/* Détails du lien */}
              <div className="flex-1 p-6 space-y-3">
                <div className="space-y-1 text-sm text-white">
                  {link.skills.map((skill, idx) => (
                    <div key={idx}>
                      <span className="font-semibold">Lvl {skill.level} :</span>{" "}
                      <Description skillId={skill.skillid} level={skill.level} dbChoice = {lang} />
                    </div>
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