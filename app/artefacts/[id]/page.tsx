"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Description from "@/components/Description";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ArtifactDetail {
    id: number;
    name: string;
    icon: string;
    level: number;
    Attrib1: string;
    value1: string;
    Attrib2: string;
    value2: string;
    Attrib3: string;
    value3: string;
    skill1Id: number;
    skill1Level: number;
    skill1: string;
    skill2Id: number;
    skill2Level: number;
    skill2: string;
    skill3Id: number;
    skill3Level: number;
    skill3: string;
    quality: number;
    profession: number;
}

const ArtifactDetailPage = () => {
    const { id } = useParams();
    const [artifact, setArtifact] = useState<ArtifactDetail | null>(null);
    const [others, setOthers] = useState<ArtifactDetail[]>([]);
    const [level, setLevel] = useState<number>(1);
    const [quality, setQuality] = useState<number>(0);
    const [lang, setLang] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);
    const router = useRouter();
    const { t } = useTranslation("common");

    const professionImages = {
      Compétence: "icon_12g_ji_attack.png",
      Guerrier: "icon_12g_gong_attack.png",
      Support: "icon_12g_fu_attack.png",
      Assassin: "icon_12g_ci_attack.png",
      Tank: "icon_12g_fang_attack.png"
    };

    const getProfessionLabel = (profession: number): string => {
      switch (profession) {
        case 1: return "Tank";
        case 2: return "Guerrier";
        case 3: return "Compétence";
        case 4: return "Assassin";
        case 5: return "Support";
        default: return null;
      }
    };


    useEffect(() => {
        const storedLang = localStorage.getItem("lang") || "FR";
        setLang(storedLang);
    }, []);

    useEffect(() => {
        if (!id || !lang) return;
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/artifacts/${id}?level=${level}`, {
                    headers: {
                        "x-db-choice": lang,
                    },
                });
                if (!res.ok) {
                    setNotFound(true);
                    setArtifact(null);
                    return;
                }
                const data = await res.json();
                setArtifact(data);
                setNotFound(false);
                if (data.length > 0) setQuality(parseInt(data[0].quality));
            } catch (error) {
                console.error("Erreur lors de la récupération du détail:", error);
                setNotFound(true);
                setArtifact(null);
            }
        };
        fetchData();
    }, [id, level, lang]);

    useEffect(() => {
        if (!artifact) return;
        const fetchOthers = async () => {
            const res = await fetch("/api/artifacts", {
                headers: {
                    "x-db-choice": lang,
                },
            });
            const all = await res.json();
            const filtered = all.filter((a: ArtifactDetail) =>
                a.id !== Number(id) &&
                String(a.quality) === String(artifact.quality)
            );
            setOthers(filtered);
        };
        fetchOthers();
    }, [artifact]);

    if (notFound) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center text-center text-white p-6">
              <div className="hidden md:block py-2 cursor-pointer">
                  <button
                      onClick={() => router.push("/artefacts")}
                      className="flex items-center gap-2 text-sm text-white px-3 py-1 rounded hover:bg-white/10 transition"
                  >
                      <ArrowLeft size={16} />
                      {t("backOthers.backToArtifacts")}
                  </button>
              </div>
              <p className="text-lg mt-4">
                  {t("errors.artifactNotFound")}
              </p>
          </div>
        );
    }

    if (!artifact || !lang) {
        return <p className="text-white">{t("interface.loading")}</p>;
    }

    // Définition des seuils pour activer chaque compétence
    const skillThresholds = {
        skill1: 1,
        skill2: 3,
        skill3: 5,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white p-6">
            <div className="max-w-screen-lg mx-auto bg-[#14122a] rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">

            
            <div className="flex flex-col items-center gap-4">

                  <div className="hidden md:block py-2 max-w-screen-xl mx-auto">
                      <button
                          onClick={() => router.push("/artefacts")}
                          className="flex items-center gap-2 text-sm text-white px-3 py-1 rounded hover:bg-white/10 transition cursor-pointer"
                      >
                          <ArrowLeft size={16} />
                          {t("backOthers.backToArtifacts")}
                      </button>
                  </div>

                {/* Image et nom */}
                <div className="relative w-[220px] aspect-[3/4] flex flex-col items-center">
                  <img
                    src={artifact.icon}
                    alt={artifact.name}
                    className="relative z-10 w-full h-auto object-contain transition-transform duration-500 group-hover:scale-102"
                  />

                  {(() => {
                    const label = getProfessionLabel(artifact.profession);
                    return label && professionImages[label] ? (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={`/images/icons/${professionImages[label]}`}
                          alt={`Icône ${label}`}
                          className="w-10 h-10"
                        />
                      </div>
                    ) : null;
                  })()}
                </div>



                <h2 className="text-xl font-semibold text-center">{artifact.name}</h2>
                {/* Cette sélection est visible uniquement en mode desktop */}
                <div className="hidden md:block">
                    <p className="text-xs text-white/60 mt-1">{t("interface.selectLevel")}</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => setLevel(lvl)}
                                className={`px-3 py-1 text-sm rounded-md shadow-md transition-all duration-150 ${
                                    level === lvl ? "bg-blue-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
                                }`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </div>
            </div>


                {/* Description des compétences */}
                <div className="flex-1 flex flex-col justify-between gap-6 pt-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{t("stat.skill")} 1</h3>
                        <div className={`text-md ${level >= skillThresholds.skill1 ? "opacity-100" : "opacity-30"}`}>
                            <Description skillId={artifact.skill1Id} level={artifact.skill1Level} dbChoice = {lang} />
                        </div>
                        <h3 className="text-lg font-semibold mt-4 mb-2">{t("stat.skill")} 2</h3>
                        <div className={`text-md ${level >= skillThresholds.skill2 ? "opacity-100" : "opacity-30"}`}>
                            <Description skillId={artifact.skill2Id} level={artifact.skill2Level} dbChoice = {lang} />
                        </div>
                        <h3 className="text-lg font-semibold mt-4 mb-2">{t("stat.skill")} 3</h3>
                        <div className={`text-md ${level >= skillThresholds.skill3 ? "opacity-100" : "opacity-30"}`}>
                            <Description skillId={artifact.skill3Id} level={artifact.skill3Level} dbChoice = {lang} />
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="bg-[#1d1b35] border border-white/10 rounded-lg p-4 text-sm flex flex-wrap gap-6 justify-center">
                        <div className="min-w-[120px]">
                            <ul className="text-xs text-white/80">
                                {artifact.Attrib1 && <li>{artifact.Attrib1.trim()}: {artifact.value1}</li>}
                                {artifact.Attrib2 && <li>{artifact.Attrib2.trim()}: {artifact.value2}</li>}
                                {artifact.Attrib3 && <li>{artifact.Attrib3.trim()}: {artifact.value3}</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtre mobile pour le niveau */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a091c] border-t border-white/10 shadow-md pt-2 pb-4">
                <p className="text-center text-xs text-white/60 mb-2">{t("interface.selectLevel")}</p>
                <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setLevel(lvl)}
                            className={`px-3 py-2 text-sm rounded-md transition-all duration-150 ${
                                level === lvl ? "bg-blue-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
                            }`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            </div>

            {/* Autres artefacts */}
            {others.length > 0 && (
                <div className="max-w-screen-lg mx-auto mt-12">
                    <h3 className="text-xl font-bold mb-4 text-center">{t("backOthers.otherArtifacts")}</h3>
                    <Swiper
                        spaceBetween={16}
                        slidesPerView={2}
                        breakpoints={{
                            640: { slidesPerView: 4 },
                            1024: { slidesPerView: 6 }
                        }}
                    >
                        {others.map((a) => (
                            <SwiperSlide key={a.id}>
                                <a href={`/artefacts/${a.id}`} className="block relative w-full aspect-[3/4] rounded-xl overflow-hidden">
                                    <img
                                        src={a.icon}
                                        alt={a.name}
                                        className="w-full h-full object-contain"
                                    />
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
};

export default ArtifactDetailPage;
