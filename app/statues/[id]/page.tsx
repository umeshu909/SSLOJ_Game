"use client";
import { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";
import Description from "@/components/Description";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

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
  id: number;
  handbookherores: string;
  icon: string;
  Attrib1: string;
  Percent1: string;
  valup1: number;
  Attrib2: string;
  Percent2: string;
  valup2: number;
  Attrib3: string;
  Percent3: string;
  valup3: number;
}

const StatueDetailPage = () => {
  const { id } = useParams();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [lang, setLang] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [multiplier, setMultiplier] = useState<number>(0);
  const router = useRouter();
  const { t } = useTranslation("common");
  const [isMobile, setIsMobile] = useState(false);

  const prefixCharacter = "sactx-0-4096x2048-ASTC 6x6-icon_touxiang-";
  const prefixSkill = "sactx-0-4096x2048-ASTC 6x6-icon_jineng-";

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "FR";
    setLang(storedLang);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 840);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!id || !lang) return;

    const fetchData = async () => {
      try {
        const [resSkills, resCharacters] = await Promise.all([
          fetch(`/api/statues/${id}/skills`, {
            headers: { "x-db-choice": lang },
          }),
          fetch(`/api/statues/${id}/characters`, {
            headers: { "x-db-choice": lang },
          }),
        ]);

        const dataSkills = await resSkills.json();
        const dataCharacters = await resCharacters.json();

        if (Array.isArray(dataSkills) && dataSkills.length > 0) {
          setSkills(dataSkills);
        }

        if (Array.isArray(dataCharacters)) {
          setCharacters(dataCharacters);
        }

        if (
          (!Array.isArray(dataSkills) || dataSkills.length === 0) &&
          (!Array.isArray(dataCharacters) || dataCharacters.length === 0)
        ) {
          setNotFound(true);
        } else {
          setNotFound(false);
        }
      } catch (err) {
        console.error(t("errors.noStatuesData"), err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, lang]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-white p-6">
          <div className="hidden md:block py-2 cursor-pointer">
              <button
                  onClick={() => router.push("/statues")}
                  className="flex items-center gap-2 text-sm text-white px-3 py-1 rounded hover:bg-white/10 transition"
              >
                  <ArrowLeft size={16} />
                  {t("backOthers.backtoStatues")}
              </button>
          </div>
          <p className="text-lg mt-4">
              {t("errors.noStatuesData")}
          </p>
      </div>
    );
  }

  if (loading || !lang) {
    return <p className="text-white text-center mt-12">{t("interface.loading")}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white p-6 pb-24">

      {characters[0]?.name && (
        <h1 className="text-2xl font-bold text-center text-white mb-6 drop-shadow-md tracking-wide">
          {characters[0].nameStatue}
        </h1>
      )}
       

      <div className="max-w-screen-xl mx-auto bg-[#14122a] rounded-xl shadow-lg px-6 py-8 flex flex-col md:flex-row gap-8">     

        <div className="w-full md:w-1/3 flex flex-col space-y-4">

          <div className="hidden md:block py-2 max-w-screen-xl mx-auto">
              <button
                  onClick={() => router.push("/statues")}
                  className="flex items-center gap-2 text-sm text-white px-3 py-1 rounded hover:bg-white/10 transition cursor-pointer"
              >
                  <ArrowLeft size={16} />
                  {t("backOthers.backtoStatues")}
              </button>
          </div>

          {/* Sélecteur visible uniquement en mode desktop */}
          <div className="hidden md:block">
            <p className="mb-1 text-sm text-white/60">{t("interface.Multiplicateur")} :</p>
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
            <h2 className="text-lg font-semibold mb-2">{t("interface.linkedCharacters")}</h2>
            {characters.map((char, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/5 p-3 rounded-lg">
                <IconCanvas
                  prefix={prefixCharacter}
                  iconName={char.icon}
                  jsonDir="/images/atlas/icon_touxiang/"
                  canvasId={`char-${i}`}
                  imgHeight={2048}
                  size={2}
                  id={char.id}
                />
                <div className="flex-1">
                  <p className="font-semibold text-white">{char.name}</p>
                  <div className="mt-2 text-xs text-white/80 flex flex-wrap gap-x-6 gap-y-1">
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
          <h2 className="text-lg font-semibold mb-4">{t("interface.StatueCompetence")}</h2>
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
                      size={isMobile ? 3 : 1}
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="text-md font-semibold mb-2">{skill.nameSkill}</h3>
                    <div className="space-y-2">
                      {group.map((g, j) => (
                        <div key={j} className="text-sm leading-snug">
                          <span className="font-semibold inline">Niv {g.level} : </span>
                          <span className="text-xs inline">
                            <Description skillId={g.skillid} level={g.level} dbChoice = {lang} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtre mobile fixé en bas */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a091c] border-t border-white/10 shadow-md p-4">
        <p className="text-center text-sm text-white/60 mb-2">{t("interface.Multiplicateur")} :</p>
        <div className="flex flex-wrap justify-center gap-1 text-xs">
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
    </div>
  );
};

export default StatueDetailPage;
