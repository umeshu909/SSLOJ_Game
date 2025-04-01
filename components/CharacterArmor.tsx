import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Description from "@/components/Description";

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

  useEffect(() => {
      const storedLang = localStorage.getItem("lang") || "FR";
      setLang(storedLang);
  }, []);

  useEffect(() => {
    async function fetchArmor() {
      try {
        setLoading(true);
        const response = await fetch(`/api/characters/${id}/armor?level=${level}`,
        {
          headers: {
            "x-db-choice": lang,
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des informations d'armure");
        }
        const data = await response.json();
        setArmor(data);
      } catch (error: any) {
        setError(error.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    if (id && lang) {
      fetchArmor();
    }
  }, [id, level, lang]);

  if (loading) return <p className="text-white">Chargement de l'armure...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!armor) return <p>Aucune armure disponible.</p>;

  /*const formatDescription = (text: string) => {
    return text.replace(/\[([^\]]+)\]/g, '<span class="text-orange-300">$1</span>');
  };*/

  // Utilisation de la logique pour déterminer si le switch est possible
  const canSwitch = armor.party === 5 || armor.party === 6 || armor.showtp === 7;

  const handleLevelChange = (selectedLevel: number) => {
    if (canSwitch) {
      setLevel(selectedLevel);
    }
  };

  return (
    <section className="lg:px-6">
      <h2 className="text-xl font-semibold text-white mb-2">Armure</h2>

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
                  <div key={index} className="mt-2 text-sm text-white flex flex-wrap items-start gap-1">
                    <span className="font-semibold">Lv {skill.unlockSkillLv}:</span>
                    <Description text={skill.skillDescription} dbChoice={lang} />
                  </div>

                ))}
              </div>
            )}



            {armor.stats.length > 0 && (
              <div className="text-sm text-white px-6 py-4 flex flex-wrap gap-x-6 border-t border-white/10">
                {/* Le toggle personnalisé pour activer/désactiver entre niveau 30 et 40 */}
                {canSwitch && (
                  <div className="rounded  flex justify-center items-center bg-[#3D3A5F]">
                    <button
                      className={`rounded py-2 px-3 ${level === 30 ? "bg-white/20 text-white" : "bg-[#3D3A5F] text-white/40"}`}
                      onClick={() => handleLevelChange(30)}
                    >
                      30
                    </button>
                    <button
                      className={`rounded py-2 px-3 ${level === 40 ? "bg-white/20 text-white " : "bg-[#3D3A5F] text-white/40"}`}
                      onClick={() => handleLevelChange(40)}
                    >
                      40
                    </button>
                  </div>
                )}
                {armor.stats.map((stat, index) => (
                  <span key={index} className="flex flex-col">
                    <span className="text-white/60">{stat.attribute}:</span>
                    <span className="font-medium text-white">{stat.formattedValue}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}