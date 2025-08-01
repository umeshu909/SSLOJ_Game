import React, { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";
import Description from "@/components/Description";
import { useTranslation } from 'next-i18next'

interface SkillLevel {
  level: number;
  description: string;
}

interface Skill {
  name: string;
  icon: string;
  levels: SkillLevel[];
  tag?: string | number;
  tagRaw?: string | number;
  original?: string;
  delay?: number;
  cooldown?: number;
  regenAttack?: number;
  regenDamage?: number;
  start?: number;
  end?: number;
}

interface Props {
  skills: any;
}

const typeStyles: Record<string, string> = {
  Cycle: "bg-blue-500/20 text-blue-300",
  Arcane: "bg-red-500/20 text-red-300",
  Passif: "bg-green-500/20 text-green-300",
  Trigger: "bg-orange-500/20 text-orange-300",
  Ouverture: "bg-purple-500/20 text-purple-300",
  Halo: "bg-pink-500/20 text-pink-300",
};

function getRawTagName(tag: number | string | undefined): string {
  switch (tag) {
    case 1:
      return "Arcane";
    case 2:
      return "Cycle";
    case 3:
      return "Passif";
    case 4:
      return "Trigger";
    case 5:
      return "Ouverture";
    case 6:
      return "Halo";
    default:
      return typeof tag === "string" ? tag : "Inconnu";
  }
}


export default function CharacterSkills({ skills }: Props) {
  const [extractedSkills, setExtractedSkills] = useState<Skill[] | null>(null);
  const [lang, setLang] = useState<string | null>(null);
  const { t } = useTranslation("common");

  function mapSkillTag(tag: string | number | undefined): string {
    switch (tag) {
      case 1:
        return t("tag.Arcane");
      case 2:
        return t("tag.Cycle");
      case 3:
        return t("tag.Passif");
      case 4:
        return t("tag.Trigger");
      case 5:
        return t("tag.Ouverture");
      case 6:
        return t("tag.Halo");
      default:
        return typeof tag === "string" ? tag : "Inconnu";
    }
  }


  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "FR";
    setLang(storedLang);
  }, []);

  useEffect(() => {
    if (!skills || !lang) return;
    extractSkills(skills, lang, mapSkillTag).then(setExtractedSkills)
  }, [skills, lang]);

  if (!extractedSkills || !lang) {
      return <p className="text-white">Chargement...</p>;
  }

  if (!extractedSkills) return null;

  const prefix = "sactx-0-4096x2048-ASTC 6x6-icon_jineng-";

  return (
    <section className="lg:px-6 pb-6">
      <h2 className="text-xl font-semibold text-white mb-2">{t("stat.skills")}</h2>

      <div className="flex flex-col gap-2">
        {extractedSkills.map((skill, index) => (
          <div
            key={index}
            className="border border-white/20 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              <div className="bg-white/5 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10 w-full md:w-[160px]">
                <IconCanvas
                  prefix={prefix}
                  iconName={skill.icon}
                  jsonDir="/images/atlas/icon_jineng/"
                  canvasId={`canvas-${index}`}
                  imgHeight={2048}
                  size={1}
                />
                <h3 className="text-white text-center text-m font-semibold mt-2">
                  {skill.name}
                </h3>
                {skill.tag && (
                  <span
                    className={`mt-2 text-sm font-semibold px-2 py-0.5 rounded-full ${typeStyles[String(skill.tagRaw)] || "bg-white/10 text-white"}`}
                  >
                    {skill.tag}
                  </span>


                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="text-sm text-white space-y-3 mb-3 p-4">
                  {skill.levels.map((lvl) => (
                    <div key={lvl.level}>
                      <span className="font-semibold">Lv {lvl.level}:</span>{" "}
                      <Description skillId={skill.id} level={lvl.level} dbChoice={lang} />
                    </div>
                  ))}
                </div>

                <div className="text-sm font-semibold text-white flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 p-4">
                  {skill.start !== undefined && skill.start !== 0 && (
                    <span>
                      <span className="font-normal text-white/80">{t("stat.start")}:</span> {(skill.start / 1000).toFixed(3)}s
                    </span>
                  )}
                  {skill.end !== undefined && skill.end !== 0 && (
                    <span>
                      <span className="font-normal text-white/80">{t("stat.end")}:</span> {(skill.end / 1000).toFixed(2)}s
                    </span>
                  )}
                  {skill.delay !== undefined && skill.delay !== 0 && (
                    <span>
                      <span className="font-normal text-white/80">{t("stat.delay")}:</span> {(skill.delay / 1000).toFixed(2)}s
                    </span>
                  )}
                  {skill.cooldown !== undefined && skill.cooldown !== 0 && (
                    <span>
                      <span className="font-normal text-white/80">{t("stat.cooldown")}:</span> {(skill.cooldown / 1000).toFixed(2)}s
                    </span>
                  )}
                  {skill.regenAttack !== undefined && skill.regenAttack !== 0 && (
                    <span>
                      <span className="font-normal text-white/80">{t("stat.gainCosmosATK")}:</span> {skill.regenAttack}
                    </span>
                  )}
                  {skill.regenDamage !== undefined && skill.regenDamage !== 0 && (
                    <span>
                      <span className="font-normal text-white/80">{t("stat.gainCosmosDMG")}:</span> {skill.regenDamage}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



async function extractSkills(
  data: any,
  lang: string,
  mapSkillTag: (tag: string | number | undefined) => string
): Promise<Skill[]> {

  const skills: Skill[] = [];

  for (let i = 1; i <= 4; i++) {
    const nameKey = `nameSkill${i}`;
    const iconKey = `iconSkill${i}`;
    const levels: SkillLevel[] = [];
    const idKey = `skillId${i}`; // i = 1 à 4
    const skillId = data[idKey];

    for (let j = 1; j <= 4; j++) {
      const levelKey = `Skill${i}Level${j}`;
      const rawDescription = data[levelKey];
      if (rawDescription) {
        levels.push({ level: j, description: rawDescription });
      }
    }

    if (data[nameKey]) {
      skills.push({
        id: skillId,
        name: data[nameKey],
        icon: data[iconKey],
        levels,
        tag: mapSkillTag(data[`skillTag${i}`]),
        tagRaw: getRawTagName(data[`skillTag${i}`]),
        original: data[`skillOriginal${i}`],
        delay: data[`skillDelay${i}`],
        cooldown: data[`skillCooldown${i}`],
        regenAttack: data[`skillregenAttack${i}`],
        regenDamage: data[`skillregenDamage${i}`],
        start: data[`startSkill${i}`],
        end: data[`endSkill${i}`],
      });
    }
  }

  return skills;
}
