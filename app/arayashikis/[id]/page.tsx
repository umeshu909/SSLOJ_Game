"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Description from "@/components/Description";

interface ArayashikiDetail {
    id: number;
    name: string;
    pic: string;
    quality: string;
    levelMax: number;
    skillid: number;
    skillid_id: number;
    level: number;
    constval: string | null;
    desc: string;
    Attrib1: string | null;
    Percent1: number | null;
    value1: number;
    gwnum1: number;
    Attrib2: string | null;
    Percent2: number | null;
    value2: number;
    gwnum2: number;
    Attrib3: string | null;
    Percent3: number | null;
    value3: number;
    gwnum3: number;
    Attrib4: string | null;
    Percent4: number | null;
    value4: number;
    gwnum4: number;
    param: string;
    hero_names: string | null;
}




const ArayashikiDetailPage = () => {
    const [detail, setDetail] = useState<ArayashikiDetail | null>(null);
    const [otherArayashikis, setOtherArayashikis] = useState<ArayashikiDetail[]>([]);
    const params = useParams();
    const id = params?.id as string | undefined;
    const [lang, setLang] = useState<string | null>(null);

    const calculateValue = (baseValue: number, gwnum: number, percent: number | null, level: number): string => {
        let adjustedValue = 0;
        let constantValue = 0;
        const levelTmp = level / 10;

        if (percent === 1) {
            constantValue = (gwnum * 100) + ((levelTmp - 1) * ((gwnum * 100) / 10));
            adjustedValue = (baseValue * 100) + ((level - 1) * constantValue);
            return adjustedValue.toFixed(2) + '%';
        } else {
            constantValue = gwnum + ((levelTmp - 1) * (gwnum / 10));
            adjustedValue = (baseValue + ((level - 1) * constantValue));
            return adjustedValue.toFixed(2);
        }
    };

    const fetchDetail = async (level = 1) => {
        try {
            const res = await fetch(`/api/arayashikis/${id}?level=${level}`, {
                headers: {
                    "x-db-choice": lang
                }
            });
            const data = await res.json();
            let levelNiv = level * 10;

            data.value1 = calculateValue(data.value1, data.gwnum1, data.Percent1, levelNiv);
            data.value2 = calculateValue(data.value2, data.gwnum2, data.Percent2, levelNiv);
            data.value3 = calculateValue(data.value3, data.gwnum3, data.Percent3, levelNiv);
            data.value4 = calculateValue(data.value4, data.gwnum4, data.Percent4, levelNiv);

            const translations: Record<string, string> = {
                "虚拟施法者 ": "Protectors knights",
                "战斗测试4 ": "Assistants knights",
                "战斗测试2 ": "Skilled knights",
                "战斗测试3 ": "Assassins knights",
                "战斗测试1 ": "Warriors knights"
            };
            if (data.hero_names && translations[data.hero_names]) {
                data.hero_names = translations[data.hero_names];
            }

            setDetail(data);


        } catch (error) {
            console.error("Erreur lors de la récupération du détail:", error);
        }
    };

    const fetchOthers = async () => {
        if (!detail) return;

        const res = await fetch("/api/arayashikis", {
            headers: {
                "x-db-choice": lang
            }
        });
        const all = await res.json();
        const filtered = all.filter(
            (a: ArayashikiDetail) => a.id !== Number(id) && a.quality === detail.quality
        );
        setOtherArayashikis(filtered);
    };

    const fetchDetailLevel = (level: number) => {
        fetchDetail(level);
    };

    useEffect(() => {
        const storedLang = localStorage.getItem("lang") || "FR";
        setLang(storedLang);
    }, []);


    useEffect(() => {
        if (id && lang) {
            fetchDetail();
        }
    }, [id, lang]);


    useEffect(() => {
        if (detail) {
            fetchOthers();
        }
    }, [detail]);

    if (!detail || !lang) {
        return <p className="text-white">Chargement...</p>;
    }


    const stats: { label: string; value: string }[] = [];

    if (detail.Attrib1) stats.push({ label: detail.Attrib1, value: detail.value1.toString() });
    if (detail.Attrib2) stats.push({ label: detail.Attrib2, value: detail.value2.toString() });
    if (detail.Attrib3) stats.push({ label: detail.Attrib3, value: detail.value3.toString() });
    if (detail.Attrib4) stats.push({ label: detail.Attrib4, value: detail.value4.toString() });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white p-6 pb-24">
            <div className="max-w-screen-lg mx-auto bg-transparent md:bg-[#14122a] rounded-xl shadow-none md:shadow-lg p-0 md:p-6 flex flex-col md:flex-row lg:gap-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-[220px] aspect-[3/4]">
                        <span className="absolute top-0 left-0 text-white text-xs font-bold px-4.5 py-6.5 rounded-br-lg z-20">
                            {detail.level * 10}
                        </span>
                        <img
                            src={`/overlays/quality-${detail.quality}.png`}
                            alt="Habillage qualité"
                            className="absolute top-0 left-0 w-full h-full object-contain z-10 pointer-events-none"
                        />
                        <div className="absolute top-1/2 left-1/2 w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2 z-0 transition-all duration-300 ease-in-out group-hover:scale-105">
                            <img
                                src={detail.pic}
                                alt={detail.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-center">{detail.name}</h2>
                    <div className="hidden md:flex justify-center gap-1 mt-2">
                        {[...Array(detail.levelMax)].map((_, index) => (
                            <span
                                key={index}
                                onClick={() => fetchDetailLevel(index + 1)}
                                className={`cursor-pointer text-yellow-400 text-2xl ${index < detail.level ? '' : 'opacity-40'}`}
                            >
                                ⭐️
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-4 pt-4">
                    <div className="gap-4">
                        <p className="text-sm opacity-80 mb-4">
                            [{detail.hero_names || "Tous les chevaliers peuvent porter"}]
                        </p>
                        <div className="leading-relaxed text-sm">
                          <Description text={detail.desc} dbChoice={lang} />
                        </div>

                    </div>
                    {stats.length > 0 && (
                        <div className="bg-[#1d1b35] border border-white/10 rounded-lg p-4 text-sm flex flex-wrap gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <span className="text-white/60">{stat.label}</span>
                                    <span className="text-white font-semibold">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {otherArayashikis.length > 0 && (
                <div className="max-w-screen-lg mx-auto mt-12">
                    <h3 className="text-xl font-bold mb-4 text-center">Autres Arayashikis</h3>
                    <Swiper
                        spaceBetween={16}
                        slidesPerView={2}
                        breakpoints={{
                            640: { slidesPerView: 4 },
                            1024: { slidesPerView: 6 }
                        }}
                    >
                        {otherArayashikis.map((a) => (
                            <SwiperSlide key={a.id}>
                                <a href={`/arayashikis/${a.id}`} className="block relative w-full aspect-[3/4] rounded-xl overflow-hidden">
                                    <img
                                        src={`/overlays/quality-${a.quality}.png`}
                                        alt="overlay"
                                        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none z-10"
                                    />
                                    <div className="absolute top-1/2 left-1/2 w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2 z-0">
                                        <img
                                            src={a.pic}
                                            alt={a.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {/* Sticky étoiles mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a091c] border-t border-white/10 shadow-md pt-2 pb-10">
                <p className="text-center text-xs text-white/60 mb-2">Sélectionner le niveau d’étoiles</p>
                <div className="flex justify-center gap-1">
                    {[...Array(detail.levelMax)].map((_, index) => (
                        <span
                            key={index}
                            onClick={() => fetchDetailLevel(index + 1)}
                            className={`cursor-pointer text-yellow-400 text-2xl ${index < detail.level ? '' : 'opacity-40'}`}
                        >
                            ⭐️
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArayashikiDetailPage;