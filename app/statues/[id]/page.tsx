"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import IconCanvas from "@/components/IconCanvas";

interface Skill {
  skillid: string;
  level: number;
  iconSkill: string;
  nameSkill: string;
  textSkill: string;
}

interface Character {
  charaId: string;
  name: string;
  handbookherores: string;
  icon: string;
  Attrib1: string;
  Percent1: string;
  valup1: number;
  Attrib2: string;
  Percent2: string;
  valup2: number;
  Attrib3: string;
  Percent2: string;
  valup2: number;
}

const StatueDetailPage = () => {
  const { id } = useParams();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [parsedDescriptions, setParsedDescriptions] = useState<Record<string, string>>({});

  const prefixCharacter = "sactx-0-4096x2048-ASTC 6x6-icon_touxiang-";
  const prefixSkill = "sactx-0-4096x2048-ASTC 6x6-icon_jineng-";

  useEffect(() => {
    if (!id) return;

    const fetchSkills = async () => {
      const lang = localStorage.getItem("lang") || "FR";
      const res = await fetch(`/api/statues/${id}/skills`,
            {
              headers: {
                "x-db-choice": lang,
              },
            });
      const data = await res.json();
      setSkills(data);
    };

    const fetchCharacters = async () => {
      const lang = localStorage.getItem("lang") || "FR";
      const res = await fetch(`/api/statues/${id}/characters`,
            {
              headers: {
                "x-db-choice": lang,
              },
            });
      const data = await res.json();
      setCharacters(data);
    };

    fetchSkills();
    fetchCharacters();
  }, [id]);

  useEffect(() => {
    const parseAll = async () => {
      const newParsed: Record<string, string> = {};
      await Promise.all(
        skills.map(async (s) => {
          const res = await fetch("/api/skills/parse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: s.textSkill, dbChoice: "FR" }),
          });
          const json = await res.json();
          let parsed = json.result || s.textSkill;
          parsed = parsed
            .replace(/(\d+([.,]\d+)?[\s\u00A0]*%)/g, '<span style="color: lightgreen;">$1</span>')
            .replace(/\[(.*?)\]/g, '<span style="color: orange;">[$1]</span>');
          newParsed[s.skillid + "_" + s.level] = parsed;
        })
      );
      setParsedDescriptions(newParsed);
    };
    if (skills.length > 0) parseAll();
  }, [skills]);

  const [multiplier, setMultiplier] = useState<number>(100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white p-6">
      <div className="max-w-screen-xl mx-auto bg-[#14122a] rounded-xl shadow-lg px-6 py-8 flex flex-col md:flex-row gap-8">

        <div className="w-full md:w-1/3 flex flex-col space-y-4">
          {/* Sélecteur */}
          <div>
            <p className="mb-1 text-sm text-white/60">Multiplicateur :</p>
            <div className="flex flex-wrap gap-1 text-xs">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                <button
                  key={val}
                  onClick={() => setMultiplier(val)}
                  className={`px-2 py-1 text-xs rounded-md transition-all duration-150 ${
                    multiplier === val
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Liste des personnages */}
          <div className="space-y-4 mt-2">
            <h2 className="text-lg font-semibold mb-2">Personnages liés</h2>
            {characters.map((char, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/5 p-3 rounded-lg">
                <IconCanvas
                  prefix={prefixCharacter}
                  iconName={char.icon}
                  jsonDir="/images/atlas/icon_touxiang/"
                  canvasId={`char-${i}`}
                  imgHeight={2048}
                  size={2}
                />
                <div className="flex-1">
                  <p className="font-semibold text-white">{char.name}</p>
                  <div className="mt-2 text-sm text-white/80 flex flex-wrap gap-x-6 gap-y-1">
                    {char.Attrib1 && (
                      <span>
                        {char.Attrib1.trim()} :{" "}
                        {char.Percent1 == "1"
                          ? `${(char.valup1 * 100 * (multiplier / 2)).toFixed(2)}%`
                          : (char.valup1 * (multiplier / 2)).toFixed(2)}
                      </span>
                    )}
                    {char.Attrib2 && (
                      <span>
                        {char.Attrib2.trim()} :{" "}
                        {char.Percent2 == "1"
                          ? `${(char.valup2 * 100 * (multiplier / 2)).toFixed(2)}%`
                          : (char.valup2 * (multiplier / 2)).toFixed(2)}
                      </span>
                    )}
                    {char.Attrib3 && (
                      <span>
                        {char.Attrib3.trim()} :{" "}
                        {char.Percent3 == "1"
                          ? `${(char.valup3 * 100 * (multiplier / 2)).toFixed(2)}%`
                          : (char.valup3 * (multiplier / 2)).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Skills */}
        <div className="w-full md:w-2/3 space-y-6">
          <h2 className="text-lg font-semibold mb-4">Compétences de la statue</h2>
          {[...new Set(skills.map((s) => s.skillid))].map((skillid) => {
            const group = skills.filter((s) => s.skillid === skillid);
            const skill = group[0];
            return (
              <div key={skillid} className="border border-white/10 rounded-xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-white/5 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10 w-full md:w-[160px]">
                    <IconCanvas
                      prefix={prefixSkill}
                      iconName={skill.iconSkill}
                      jsonDir="/images/atlas/icon_jineng/"
                      canvasId={`canvas-skill-${skillid}`}
                      imgHeight={2048}
                      size={1}
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="text-md font-semibold mb-2">{skill.nameSkill}</h3>
                    <div className="space-y-2">
                      {group.map((g, j) => (
                        <p
                          key={j}
                          className="text-sm leading-snug"
                        >
                          <span className="font-semibold">Niv {g.level} : </span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html:
                                parsedDescriptions[g.skillid + "_" + g.level] || g.textSkill,
                            }}
                          />
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatueDetailPage;
