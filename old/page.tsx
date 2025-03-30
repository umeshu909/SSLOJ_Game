"use client";
import { useEffect, useState } from "react";
    import { useParams } from "next/navigation";


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

    const { id } = useParams();

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
            const res = await fetch(`/api/arayashikis/${id}?level=${level}`);
            const data = await res.json();
            let levelNiv = level * 10;

            // Calculer les valeurs dynamiques pour chaque attribut
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

    const fetchDetailLevel = (level: number) => {
        fetchDetail(level);
    };

    useEffect(() => {
        if (id) fetchDetail();
    }, [id]);

    if (!detail) {
        return <p className="text-white">Chargement...</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">{detail.name}</h1>
            <div className="flex flex-col items-center gap-4 text-center bg-[#14122a] rounded-xl p-6 shadow-lg">
                <div className="relative">

                    <div className="relative w-full aspect-[3/4]">
                        {/* Niveau en haut à gauche */}
                        <span className="absolute top-0 left-0  text-white text-xs font-bold px-3 py-4.5 rounded-br-lg z-20">
                            {detail.level * 10}
                        </span>

                        {/* Image du personnage centrée */}
                        <div className="absolute top-1/2 left-1/2 w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2 z-0">
                            <img
                                src={detail.pic}
                                alt={detail.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Overlay décoratif par-dessus */}
                        {detail.quality && (
                            <img
                                src={`/overlays/quality-${detail.quality}.png`}
                                alt="Habillage qualité"
                                className="absolute top-0 left-0 w-full h-full object-contain z-10 pointer-events-none"
                            />
                        )}
                    </div>

                    <div className="flex justify-center gap-1 mt-2">
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
                
                
                <div className="flex flex-col gap-2">
                    <p>[{detail.hero_names || "Tous les chevaliers peuvent porter"}]</p>
                    <p>Description: {detail.desc}</p>
                    <p>
                        {detail.Attrib1 && `${detail.Attrib1}: `}<span className="text-green-400">{detail.value1}</span>
                        {detail.Attrib2 && ` | ${detail.Attrib2}: `}<span className="text-green-400">{detail.value2}</span>
                        {detail.Attrib3 && ` | ${detail.Attrib3}: `}<span className="text-green-400">{detail.value3}</span>
                        {detail.Attrib4 && ` | ${detail.Attrib4}: `}<span className="text-green-400">{detail.value4}</span>
                    </p>
                    
                </div>
            </div>
        </div>
    );
};

export default ArayashikiDetailPage;
