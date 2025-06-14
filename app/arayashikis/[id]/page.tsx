"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Description from "@/components/Description";
import IconCanvas from "@/components/IconCanvas";
import { ArrowLeft } from "lucide-react";

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
    hero_imgs?: string;
    hero_names_translated?: string;
}

const ArayashikiDetailPage = () => {
    const [detail, setDetail] = useState<ArayashikiDetail | null>(null);
    const [otherArayashikis, setOtherArayashikis] = useState<ArayashikiDetail[]>([]);
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string | undefined;
    const [lang, setLang] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);


    const xpByRange = [
        { from: 0, to: 10, xp: 810 },
        { from: 11, to: 20, xp: 1850 },
        { from: 21, to: 30, xp: 3400 },
        { from: 31, to: 40, xp: 5400 },
        { from: 41, to: 50, xp: 8500 },
        { from: 51, to: 60, xp: 12500 },
    ];

    const [startLevel, setStartLevel] = useState<number | null>(null);
    const [endLevel, setEndLevel] = useState<number | null>(null);

    const calculateValue = (base: number, gwnum: number, percent: number | null, level: number): string => {
        const levelTmp = level / 10;
        let constantValue = percent === 1
            ? (gwnum * 100) + ((levelTmp - 1) * ((gwnum * 100) / 10))
            : gwnum + ((levelTmp - 1) * (gwnum / 10));

        const adjustedValue = percent === 1
            ? (base * 100) + ((level - 1) * constantValue)
            : (base + ((level - 1) * constantValue));

        return percent === 1 ? adjustedValue.toFixed(2) + "%" : adjustedValue.toFixed(2);
    };

    const fetchDetail = async (level = 1) => {
        try {
            const res = await fetch(`/api/arayashikis/${id}?level=${level}`, {
                headers: { "x-db-choice": lang! }
            });
            if (!res.ok) {
                setNotFound(true);
                return;
            }

            const data = await res.json();
            const levelNiv = level * 10;

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

            const translationsOr: Record<number, string> = {
                4: "Chevaliers d'or"
            };

            let translated = data.hero_names && translations[data.hero_names] || null;
            if (data.condition && translationsOr[data.condition]) {
                translated = translationsOr[data.condition];
            }

            data.hero_names_translated = translated;
            setDetail(data);
            setNotFound(false);
        } catch (err) {
            console.error("Erreur lors du chargement du détail :", err);
            setNotFound(true);
        }
    };

    const fetchOthers = async () => {
        if (!detail) return;

        const res = await fetch("/api/arayashikis", {
            headers: {
                "x-db-choice": lang!
            }
        });
        const all = await res.json();

        const filtered = all.filter(
            (a: ArayashikiDetail) => a.id !== Number(id) && a.quality === detail.quality
        );

        // Mélange aléatoire
        const shuffled = filtered.sort(() => 0.5 - Math.random());

        setOtherArayashikis(shuffled);
    };

    const fetchDetailLevel = (level: number) => fetchDetail(level);

    const computeTotalXP = (start: number, end: number): number => {
        return xpByRange.reduce((acc, range) => {
            if (end <= range.from || start > range.to) return acc;
            const overlapStart = Math.max(start, range.from);
            const overlapEnd = Math.min(end, range.to);
            if (overlapStart <= overlapEnd) {
                acc += range.xp;
            }
            return acc;
        }, 0);
    };

    const getLevelOptions = (maxLevel: number) => {
        const levels: number[] = [];
        for (let i = 0; i <= maxLevel * 10; i += 10) {
            levels.push(i);
        }
        return levels;
    };


const getBookDistribution = (xp: number) => {
    const books = [
        { color: "bg-white", xp: 10, targetPercent: 0.3 },
        { color: "bg-blue-500", xp: 50, targetPercent: 0.25 },
        { color: "bg-purple-500", xp: 250, targetPercent: 0.25 },
        { color: "bg-yellow-400", xp: 1000, targetPercent: 0.2 },
    ];

    const result: { color: string; border?: string; count: number }[] = [];

    let totalAllocated = 0;

    // 1. Calcul de base en respectant les pourcentages
    const provisional: { color: string; border?: string; xp: number; count: number }[] = [];

    for (const book of books) {
        if (book.xp > xp) continue; // Trop gros pour ce besoin
        const targetXP = Math.floor(xp * book.targetPercent);
        const count = Math.max(1, Math.floor(targetXP / book.xp)); // Au moins 1
        provisional.push({
            color: book.color,
            border: book.color === "bg-white" ? "border border-gray-300" : undefined,
            xp: book.xp,
            count,
        });
        totalAllocated += count * book.xp;
    }

    // 2. Ajustement si trop d'XP alloué : on réduit les plus petits d’abord
    let remaining = xp - totalAllocated;
    if (remaining < 0) {
        for (let i = provisional.length - 1; i >= 0; i--) {
            const book = provisional[i];
            while (book.count > 1 && remaining < 0) {
                book.count--;
                remaining += book.xp;
            }
        }
    }

    // 3. Ajustement si pas assez : on comble avec des livres blancs
    if (remaining > 0) {
        const white = provisional.find(b => b.xp === 10);
        if (white) {
            white.count += Math.ceil(remaining / 10);
        } else {
            provisional.push({
                color: "bg-white",
                border: "border border-gray-300",
                xp: 10,
                count: Math.ceil(remaining / 10),
            });
        }
    }

    // 4. Finalisation
    for (const book of provisional) {
        result.push({
            color: book.color,
            border: book.border,
            count: book.count,
        });
    }

    return result;
};



    useEffect(() => {
        const storedLang = localStorage.getItem("lang") || "FR";
        setLang(storedLang);
    }, []);

    useEffect(() => {
        if (id && lang) fetchDetail();
    }, [id, lang]);

    useEffect(() => {
        if (detail) fetchOthers();
    }, [detail]);

    useEffect(() => {
        if (detail) {
            const max = detail.levelMax * 10;
            setStartLevel(0);
            setEndLevel(Math.min(10, max));
        }
    }, [detail]);


    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center text-white p-6">
                {/* RETOUR */}
                <div className="hidden md:block py-2">
                    <button
                        onClick={() => router.push("/arayashikis")}
                        className="flex items-center gap-2 text-sm text-white px-3 py-1 rounded hover:bg-white/10 transition cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Retour aux arayashikis
                    </button>
                </div>

                {/* TEXTE D'INFORMATION */}
                <p className="text-lg mt-4">
                    Cette carte n’est pas disponible dans la base de données sélectionnée.
                </p>
            </div>

        );
    }

    if (!detail || !lang) {
        return <p className="text-white">Chargement...</p>;
    }


    const stats = [
        detail.Attrib1 && { label: detail.Attrib1, value: detail.value1 },
        detail.Attrib2 && { label: detail.Attrib2, value: detail.value2 },
        detail.Attrib3 && { label: detail.Attrib3, value: detail.value3 },
        detail.Attrib4 && { label: detail.Attrib4, value: detail.value4 }
    ].filter(Boolean) as { label: string; value: string }[];



    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white pt-[12px] pb-24">
            {/* RETOUR */}
            <div className="hidden md:block py-2 max-w-screen-xl mx-auto">
                <button
                    onClick={() => router.push("/arayashikis")}
                    className="flex items-center gap-2 text-sm text-white px-3 py-1 rounded hover:bg-white/10 transition cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Retour aux arayashikis
                </button>
            </div>

            <div className="max-w-screen-xl mx-auto bg-transparent md:bg-[#14122a] shadow-none md:shadow-lg p-0 md:p-6 flex flex-col md:flex-row lg:gap-8">
                {/* IMAGE + NOM */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-[220px] aspect-[3/4]">
                        <span className="absolute top-0 left-0 text-white text-xs font-bold px-4.5 py-6.5 rounded-br-lg z-20">
                            {detail.level * 10}
                        </span>
                        <img
                            src={`/overlays/quality-${detail.quality}.png`}
                            alt="overlay"
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
                        {[...Array(detail.levelMax)].map((_, i) => (
                            <span
                                key={i}
                                onClick={() => fetchDetailLevel(i + 1)}
                                className={`cursor-pointer text-yellow-400 text-2xl ${i < detail.level ? "" : "opacity-40"}`}
                            >
                                ⭐️
                            </span>
                        ))}
                    </div>
                </div>

                {/* DETAILS */}
                <div className="flex-1 flex flex-col justify-between gap-4 p-6">
                    <div className="space-y-4">
                        {/* Groupe image + description */}
                        {detail.hero_names_translated ? (
                            <p className="text-sm opacity-80">{detail.hero_names_translated}</p>
                        ) : detail.hero_imgs ? (
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {detail.hero_imgs
                                    .split(",")
                                    .filter(name => name.trim())
                                    .map((img, i) => (
                                        <IconCanvas
                                            key={i}
                                            prefix="sactx-0-4096x2048-ASTC 6x6-icon_touxiang-"
                                            iconName={img}
                                            jsonDir="/images/atlas/icon_touxiang/"
                                            canvasId={`canvas-${img}`}
                                            imgHeight={2048}
                                            size={2}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <p className="text-sm opacity-80">Tous les chevaliers peuvent porter</p>
                        )}

                        <div className="leading-relaxed text-sm md:max-w-[50%]">
                            <Description skillId={detail.skillid} level={detail.level} dbChoice = {lang} />
                        </div>
                    </div>

                    {/* Bloc stats fixé en bas de la colonne */}
                    {stats.length > 0 && (
                        <div className="bg-[#1d1b35] border border-white/10 rounded-lg p-4 text-sm flex flex-wrap gap-6">
                            {stats.map((s, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <span className="text-white/60">{s.label}</span>
                                    <span className="text-white font-semibold">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    )}



                    {startLevel !== null && endLevel !== null && (
                    <div className="bg-[#1d1b35] border border-white/10 rounded-lg p-4 text-sm mt-4 space-y-4">
                        <h3 className="text-base font-semibold text-white">XP nécessaire pour monter de niveau</h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label htmlFor="start-level" className="text-white/70">Niveau de départ</label>
                                <select
                                    id="start-level"
                                    value={startLevel}
                                    onChange={(e) => setStartLevel(Number(e.target.value))}
                                    className="bg-[#2a2749] text-white px-2 py-1 rounded"
                                >
                                    {getLevelOptions(detail.levelMax)
                                        .filter(v => endLevel !== null && v < endLevel)
                                        .map(v => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}

                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor="end-level" className="text-white/70">Niveau final</label>
                                <select
                                    id="end-level"
                                    value={endLevel}
                                    onChange={(e) => setEndLevel(Number(e.target.value))}
                                    className="bg-[#2a2749] text-white px-2 py-1 rounded"
                                >
                                    {getLevelOptions(detail.levelMax)
                                        .filter(v => startLevel !== null && v > startLevel)
                                        .map(v => (
                                            <option key={v} value={v}>{v}</option>
                                        ))}

                                </select>
                            </div>
                        </div>
                        <p className="text-white">
                            XP totale requise : <strong>{computeTotalXP(startLevel + 1, endLevel)}</strong>
                        </p>


                        <div className="flex items-center gap-4 flex-wrap">
                            {getBookDistribution(computeTotalXP(startLevel + 1, endLevel)).map((book, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                    <div className={`w-5 h-5 rounded-sm ${book.color} ${book.border || ""}`} />
                                    <span className="text-white">{book.count}</span>
                                </div>
                            ))}
                        </div>



                    </div>
                    )}


                </div>




            </div>

            {/* SWIPER AUTRES */}
            {otherArayashikis.length > 0 && (
                <div className="max-w-screen-lg mx-auto my-12">
                    <h3 className="text-xl font-bold mb-4 text-center">Autres Arayashikis</h3>

                    {/* ✅ Wrapper avec padding horizontal */}
                    <div className="px-6">
                        <Swiper
                            spaceBetween={16}
                            breakpoints={{
                                0: { slidesPerView: 3, spaceBetween: 12 }, // Mobile
                                640: { slidesPerView: 4 },
                                1024: { slidesPerView: 6 },
                            }}
                        >
                            {otherArayashikis.map((a) => (
                                <SwiperSlide key={a.id}>
                                    <a
                                        href={`/arayashikis/${a.id}`}
                                        className="block relative w-full aspect-[3/4] rounded-xl overflow-hidden"
                                    >
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
                </div>
            )}

            {/* Sticky étoiles mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a091c] border-t border-white/10 shadow-md pt-2 pb-10">
                <p className="text-center text-xs text-white/60 mb-2">Sélectionner le niveau d’étoiles</p>
                <div className="flex justify-center gap-1">
                    {[...Array(detail.levelMax)].map((_, i) => (
                        <span
                            key={i}
                            onClick={() => fetchDetailLevel(i + 1)}
                            className={`cursor-pointer text-yellow-400 text-2xl ${i < detail.level ? "" : "opacity-40"}`}
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