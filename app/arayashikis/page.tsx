"use client";
import { useEffect, useState } from "react";

interface Arayashiki {
    id: number;
    name: string;
    pic: string;
    quality: string;
    level: string;
}

const qualityMapping: Record<number, string> = {
    2: "bg-gray-500",
    3: "bg-blue-500",
    4: "bg-purple-500",
    5: "bg-yellow-500",
    6: "bg-red-500"
};

const ArayashikisPage = () => {
    const [arayashikis, setArayashikis] = useState<Arayashiki[]>([]);
    const [selectedQuality, setSelectedQuality] = useState<number | null>(null);

    const fetchArayashikis = async () => {
        const lang = localStorage.getItem("lang") || "FR";
        const qualityParam = selectedQuality !== null ? `?quality=${selectedQuality}` : "";
        const res = await fetch(`/api/arayashikis${qualityParam}`, {
            headers: {
                "x-db-choice": lang
            }
        });
        const data = await res.json();
        setArayashikis(data.reverse());
    };

    useEffect(() => {
        fetchArayashikis();
    }, [selectedQuality]);

    const selectQuality = (qualityId: number) => {
        setSelectedQuality((prevSelectedQuality) =>
            prevSelectedQuality === qualityId ? null : qualityId
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white">
            <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-4">
                {/* Sidebar des filtres */}
                <div className="hidden lg:flex flex-col w-[320px] sticky top-[98px] h-fit bg-[#14122a] rounded-xl p-6 text-white">
                    <h2 className="text-2xl font-semibold mb-4">Filtres</h2>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Qualité</h3>
                        <div className="space-x-2">
                            {Object.keys(qualityMapping).map((key) => {
                                const qualityId = Number(key);
                                return (
                                    <button
                                        key={qualityId}
                                        className={`w-8 h-8 rounded-full m-1 border-2 ${selectedQuality === qualityId ? "border-[#82B0D6]" : "border-white/20"
                                            } ${qualityMapping[qualityId]} hover:border-[#82B0D6] transition-all`}
                                        onClick={() => selectQuality(qualityId)}
                                        title={qualityMapping[qualityId].replace("bg-", "").replace("-500", "")}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Grille des cartes */}
                <div className="w-full lg:w-3/4 px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3">
                        {arayashikis.length === 0 ? (
                            <p className="text-center text-lg">Aucune carte trouvée</p>
                        ) : (
                            arayashikis.map((arayashiki) => (
                                <a
                                    key={arayashiki.id}
                                    href={`/arayashikis/${arayashiki.id}`}
                                    className="group block rounded-xl overflow-visible mb-1"
                                >
                                    {/* Carte avec ratio fixe */}
                                    <div className="relative w-full aspect-[3/4]">
                                        {/* Image du personnage centrée */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 transition-all duration-300 ease-in-out group-hover:scale-103 w-[90%] h-[90%]">
                                            <img
                                                src={arayashiki.pic}
                                                alt={arayashiki.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        {/* Overlay décoratif par-dessus */}
                                        {arayashiki.quality && (
                                            <img
                                                src={`/overlays/quality-${arayashiki.quality}.png`}
                                                alt="Habillage qualité"
                                                className="absolute top-0 left-0 w-full h-full object-contain z-10 pointer-events-none"
                                            />
                                        )}
                                    </div>

                                    {/* Nom du personnage */}
                                    <div className="mt-1 px-1">
                                        <h3 className="text-sm font-semibold text-white text-center leading-tight">
                                            {arayashiki.name}
                                        </h3>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArayashikisPage;