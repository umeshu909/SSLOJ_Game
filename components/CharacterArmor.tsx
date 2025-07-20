"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Description from "@/components/Description";
import { useTranslation } from 'next-i18next'

interface ArmorSkill {
  skillId: number;
  skillDescription: string;
  unlockSkillLv: number;
}

interface Stat {
  attribute: string;
  value: number;
  growth: number;
  percent: boolean;
  formattedValue: string;
}

interface Armor {
  name: string;
  overname: string;
  icon: string;
  stats: Stat[];
  skills: ArmorSkill[];
  party: number;
  showtp: number;
  level: number;
  canSwitch: boolean;
}

export default function CharacterArmor() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [armor, setArmor] = useState<Armor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(30); // Niveau initial de l'armure (par défaut 30)
  const [lang, setLang] = useState<string | null>(null);
  const { t } = useTranslation("common");
  const [buttonSelected, setButtonSelected] = useState<number | null>(null);


  useEffect(() => {
      const storedLang = localStorage.getItem("lang") || "FR";
      setLang(storedLang);
  }, []);

  useEffect(() => {
    //let shouldSetLoading = level === 30 || level === 40;
    let shouldSetLoading = true;
    async function fetchArmor() {
      //if (shouldSetLoading) setLoading(true);
      try {
        const response = await fetch(`/api/characters/${id}/armor?level=${level}`, {
          headers: {
            "x-db-choice": lang,
          },
        });
        if (!response.ok) {
          throw new Error(t("errors.noArmor"));
        }
        const data = await response.json();
        setArmor(data);
      } catch (error: any) {
        setError(error.message || "Erreur inconnue");
      } finally {
        if (shouldSetLoading) setLoading(false);
      }
    }

    if (id && lang) {
      fetchArmor();
    }
  }, [id, level, lang]);



  if (loading) return <p className="text-white">{t("interface.loading")}</p>;
  if (error) return <div className="text-center"><h2 className="text-xl font-semibold">{error}</h2></div>
  if (!armor) return <p>t("errors.noArmor")}</p>;

  /*const formatDescription = (text: string) => {
    return text.replace(/\[([^\]]+)\]/g, '<span class="text-orange-300">$1</span>');
  };*/

  // Utilisation de la logique pour déterminer si le switch est possible
  const canSwitch = armor.party === 5 || armor.party === 6 || armor.showtp == 7;
  const handleLevelChange = (selectedLevel: number) => {
    if (canSwitch) {
      setLevel(selectedLevel);
      setButtonSelected(selectedLevel);
    }
  };

  return (
  <section className="lg:px-6 relative">
    <h2 className="text-xl font-semibold text-white mb-2">{t("interface.armor")}</h2>
    {/* Overlay de chargement */}
    {loading && (
      <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-10">
        <p className="text-white">{t("interface.loading")}</p>
      </div>
    )}
    {error ? (
      <p className="text-red-500">{error}</p>
    ) : armor ? (
      <div className="border border-white/20 rounded-xl overflow-hidden mb-4">
        <div className="flex flex-col md:flex-row">
          <div className="bg-white/5 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10 w-full md:w-[160px]">
            <img
              src={`/images/atlas/shengyilihui/${armor.icon}.png`}
              alt={armor.name}
              className="w-32 h-32 mb-2 object-cover"
            />
            <h3 className="text-white text-center font-semibold">{armor.name}</h3>
            <p className="text-white text-center text-sm">{armor.overname}</p>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {armor.skills.length > 0 && (
              <div className="p-6 space-y-1 text-white text-sm">
                {armor.skills.map((skill, index) => (
                  <div key={index} className="mt-2 text-sm text-white">
                    <span className="font-semibold inline">Lv {skill.unlockSkillLv}: </span>
                    <span className="inline">
                      <Description text={skill.skillDescription} dbChoice={lang} />
                    </span>
                  </div>
                ))}
              </div>
            )}
            {armor.stats.length > 0 && (
              <div className="text-sm text-white px-6 py-4 flex flex-wrap gap-x-6 border-t border-white/10">


                {armor.stats.map((stat, index) => (
                  <span key={index} className="flex flex-col">
                    <span className="text-white/60">{stat.attribute}:</span>
                    <span className="font-medium text-white">{stat.formattedValue}</span>
                  </span>
                ))}

                {canSwitch && (
                  <div className="w-full mt-4 ">

                    <div className="flex items-center gap-4">{t("stat.Level")}
                      {/* Slider */}
                      <div className="flex-1">
                        <input
                          type="range"
                          min={30}
                          max={40}
                          step={1}
                          value={level}
                          onChange={(e) => handleLevelChange(Number(e.target.value))}
                          className="w-full accent-yellow-400"
                        />
                        <div className="flex justify-between text-xs text-white/60 mt-1">
                          {[...Array(11)].map((_, i) => (
                            <span key={i}>{30 + i}</span>
                          ))}
                        </div>
                      </div>

                      {/* Coût en sang de Dieu */}
                      <div className="flex items-center gap-1 min-w-[90px]">
                        <img
                          src="/images/icons/sang_or_transparent.png"
                          alt="Sang de Dieu"
                          className="w-6 h-6"
                        />
                        <span className="text-white text-sm">
                          {(() => {
                            const levelCosts: Record<number, number> = {
                              30: 0, 31: 50, 32: 100, 33: 160, 34: 220, 35: 290,
                              36: 370, 37: 470, 38: 590, 39: 750, 40: 950,
                            };
                            return levelCosts[level] ?? 0;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}



              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center">
        <h2 className="text-xl font-semibold">{t("errors.noArmor")}</h2>
      </div>
    )}
  </section>
);

}