"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import IconCanvas from "@/components/IconCanvas";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft } from "lucide-react";
import "swiper/css";
import Description from "@/components/Description";

interface VestigeDetail {
    id: number;
    name: string;
    pic: string;
    skillid: string;
    skillname: string;
    level: number;
    icon: string;
    desc: string;
    quality: number;
}

interface CareerValue {
    metier: number;
    metierText: string;
    times: number;
    Attrib1: string;
    value1: string;
    Attrib2: string;
    value2: string;
    Attrib3: string;
    value3: string;
    Attrib4: string | null;
    value4: string;
}

interface AllValue {
    AttribAll1: string;
    valueAll1: string;
    AttribAll2: string;
    valueAll2: string;
    AttribAll3: string;
    valueAll3: string;
}

const VestigeDetailPage = () => {
    const [details, setDetails] = useState<VestigeDetail[]>([]);
    const [careerValues, setCareerValues] = useState<CareerValue[]>([]);
    const [allValues, setAllValues] = useState<AllValue | null>(null);
    const [others, setOthers] = useState<VestigeDetail[]>([]);
    const [lang, setLang] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const [level, setLevel] = useState<number>(5);
    const [quality, setQuality] = useState<number>(3);

    const prefix = "sactx-0-2048x4096-ASTC 6x6-shenghen-";
    const prefix2 = "sactx-0-4096x2048-ASTC 6x6-icon_jineng-";

    useEffect(() => {
        const storedLang = localStorage.getItem("lang") || "FR";
        setLang(storedLang);
    }, []);

    useEffect(() => {
        if (!id || !lang) return;
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/vestiges/${id}`, {
                    headers: {
                        "x-db-choice": lang,
                    },
                });

                if (!res.ok) throw new Error("Not OK");

                const data = await res.json();
                if (Array.isArray(data)) {
                    if (data.length > 0) {
                        setDetails(data);
                        setNotFound(false);
                        setQuality(data[0].quality);
                    } else {
                        setNotFound(true);
                    }
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (err) {
                console.error("API /api/vestiges/:id error:", err);
                setDetails([]);
                setNotFound(true);
            }
        };
        fetchData();
    }, [id, lang]);

    useEffect(() => {
        if (!id || !quality || !lang) return;
        const fetchValues = async () => {
            try {
                const [res1, res2] = await Promise.all([
                    fetch(`/api/vestiges/${id}/values?level=${level}`, {
                        headers: { "x-db-choice": lang },
                    }),
                    fetch(`/api/vestiges/${id}/valuesall?level=${level}&quality=${quality}`, {
                        headers: { "x-db-choice": lang },
                    }),
                ]);

                if (res1.ok) {
                    const data1 = await res1.json();
                    if (Array.isArray(data1)) {
                        setCareerValues(data1);
                    }
                }

                if (res2.ok) {
                    const data2 = await res2.json();
                    if (Array.isArray(data2)) {
                        setAllValues(data2[0]);
                    }
                }
            } catch (err) {
                console.error("Erreur lors du chargement des valeurs:", err);
            }
        };
        fetchValues();
    }, [id, level, quality, lang]);

    useEffect(() => {
        const fetchOthers = async () => {
            if (!quality || !lang) return;
            try {
                const res = await fetch("/api/vestiges", {
                    headers: { "x-db-choice": lang },
                });
                const all = await res.json();
                if (Array.isArray(all)) {
                    const filtered = all.filter((v: VestigeDetail) => v.id !== Number(id) && v.quality === quality);
                    setOthers(filtered);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des autres vestiges:", err);
            }
        };
        fetchOthers();
    }, [quality, lang]);

    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center text-white p-6">
                <div className="hidden md:block py-2">
                    <button
                        onClick={() => router.push("/vestiges")}
                        className="flex items-center gap-2 text-sm text-white px-3 py-1 rounded hover:bg-white/10 transition cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Retour aux vestiges
                    </button>
                </div>
                <p className="text-lg mt-4">
                    Ce vestige n’est pas disponible dans la base de données sélectionnée.
                </p>
            </div>
        );
    }

    if (!lang || details.length === 0) {
        return <p className="text-white text-center mt-12">Chargement...</p>;
    }

    const main = details[0];
    const getLevelThreshold = (skillIndex: number, skillLevelIndex: number): number => {
        if ([...new Set(details.map((d) => d.skillid))].length === 1) {
            return (skillLevelIndex + 1) * 10;
        }
        return (skillLevelIndex + 1) * 10 - (skillIndex === 0 ? 5 : 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white pb-24">
            <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white pb-24">
                <div className="hidden md:block py-2 max-w-screen-xl mx-auto">
                    <button
                        onClick={() => router.push("/vestiges")}
                        className="flex items-center gap-2 text-sm text-white px-3 py-1 rounded hover:bg-white/10 transition cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Retour aux vestiges
                    </button>
                </div>
                <div className="max-w-screen-xl mx-auto bg-[#14122a] rounded-xl shadow-lg px-6 pt-6 pb-1 flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center gap-4 justify-center">
                        <div className="relative w-[280px] flex items-center justify-center">
                            <IconCanvas
                                prefix={prefix}
                                iconName={main.pic}
                                jsonDir="/images/atlas/shenghen/"
                                canvasId={`canvas-${id}`}
                                imgHeight={4096}
                                size={3}
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-center max-w-[90%] break-words">{main.name}</h2>
                        <div className="hidden md:flex gap-1 mt-2">
                            {[5, 10, 15, 20, 25, 30].map((lvl) => (
                                <button
                                    key={lvl}
                                    onClick={() => setLevel(lvl)}
                                    className={`px-3 py-1 text-sm rounded-md transition-all duration-150 ${level === lvl ? "bg-blue-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
                                        }`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-6">
                        <div className="space-y-4">
                            {[...new Set(details.map((d) => d.skillid))].map((skillid, i) => {
                                const group = details.filter((d) => d.skillid === skillid);
                                const skill = group[0];
                                return (
                                    <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="bg-white/5 w-full md:w-[160px] p-4 border-b md:border-b-0 md:border-r border-white/10">
                                                <div className="flex items-center md:items-center md:justify-center gap-3 md:flex-col md:gap-2 h-full">
                                                    <IconCanvas
                                                        prefix={prefix2}
                                                        iconName={skill.icon}
                                                        jsonDir="/images/atlas/icon_jineng/"
                                                        canvasId={`canvas-skill-${skillid}`}
                                                        imgHeight={2048}
                                                        size={1.5}
                                                        className="w-14 h-14 md:w-[100px] md:h-[100px]"
                                                    />
                                                    <h3 className="text-sm font-semibold md:hidden text-left">{skill.skillname}</h3>
                                                </div>
                                            </div>
                                            <div className="flex-1 p-4">
                                                <h3 className="text-md font-semibold mb-2 hidden md:block">{skill.skillname}</h3>
                                                <div className="space-y-2">
                                                    {group.map((g, j) => {
                                                        const threshold = getLevelThreshold(i, j);
                                                        const isActive = level >= threshold;
                                                        return (
                                                            <div
                                                                key={j}
                                                                className={`text-sm leading-snug ${isActive ? "opacity-100" : "opacity-30"}`}
                                                            >
                                                                <span className="font-semibold">Niv {g.level} : </span>
                                                                <div className="text-md inline">
                                                                    <Description skillId={g.skillid} level={g.level} dbChoice = {lang} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a091c] border-t border-white/10 shadow-md pt-2 pb-10">
                    <p className="text-center text-xs text-white/60 mb-2">Sélectionner le niveau</p>
                    <div className="flex justify-center gap-1">
                        {[5, 10, 15, 20, 25, 30].map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => setLevel(lvl)}
                                className={`px-3 py-2 text-sm rounded-md transition-all duration-150 ${level === lvl ? "bg-blue-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
                                    }`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-screen-xl mx-auto bg-[#14122a] rounded-xl shadow-lg px-6 pt-0 pb-6">
                    <div className="p-0">
                        <h3 className="text-sl mb-4 text-left">Statistiques selon le rôle</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {Array.isArray(careerValues) && careerValues.map((cv, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-6 text-sm">
                                    <h4 className="text-white font-semibold text-center mb-2">{cv.metierText}</h4>
                                    <ul className="text-sm text-white/80 space-y-1">
                                        {cv.Attrib1 && <li>{cv.Attrib1.trim()}: {cv.value1}</li>}
                                        {cv.Attrib2 && <li>{cv.Attrib2.trim()}: {cv.value2}</li>}
                                        {cv.Attrib3 && <li>{cv.Attrib3.trim()}: {cv.value3}</li>}
                                        {cv.Attrib4 && <li>{cv.Attrib4.trim()}: {cv.value4}</li>}
                                    </ul>
                                </div>
                            ))}
                            {allValues && (
                                <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-sm">
                                    <h4 className="text-white font-semibold text-center mb-2">Commun</h4>
                                    <ul className="text-sm text-white/80 space-y-1">
                                        <li>{allValues.AttribAll1.trim()}: {allValues.valueAll1}</li>
                                        <li>{allValues.AttribAll2.trim()}: {allValues.valueAll2}</li>
                                        <li>{allValues.AttribAll3.trim()}: {allValues.valueAll3}</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {others.length > 0 && (
                    <div className="max-w-screen-lg mx-auto mt-12 px-4">
                        <h3 className="text-xl font-bold mb-4 text-center">Autres vestiges</h3>
                        <Swiper
                            spaceBetween={16}
                            slidesPerView={3}
                            breakpoints={{
                                640: { slidesPerView: 4 },
                                1024: { slidesPerView: 6 },
                            }}
                            className="relative w-full overflow-hidden" // Assurer que le Swiper est correctement limité
                        >
                            {others.map((v) => (
                                <SwiperSlide key={v.id}>
                                    <a
                                        href={`/vestiges/${v.id}`}
                                        className="block relative w-full h-full aspect-auto rounded-xl overflow-hidden"
                                    >
                                        <IconCanvas
                                            prefix={prefix}
                                            iconName={v.pic}
                                            jsonDir="/images/atlas/shenghen/"
                                            canvasId={`preview-${v.id}`}
                                            imgHeight={4096}
                                            size={3}
                                            className="w-full h-full object-cover" // Ajuste la taille de l'image pour qu'elle ne dépasse pas
                                        />
                                    </a>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VestigeDetailPage;