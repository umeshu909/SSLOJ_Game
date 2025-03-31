"use client";
import { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";

interface Vestige {
    id: number;
    name: string;
    pic: string;
    quality: string;
    skillshow: string;
}

const qualityMapping: Record<number, string> = {
    3: "bg-purple-500",
    4: "bg-yellow-500",
};

const VestigesPage = () => {
    const [Vestiges, setVestiges] = useState<Vestige[]>([]);
    const [selectedQuality, setSelectedQuality] = useState<number | null>(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const fetchVestiges = async () => {
        const qualityParam = selectedQuality !== null ? `?quality=${selectedQuality}` : "";
        const lang = localStorage.getItem("lang") || "FR";
        const res = await fetch(`/api/vestiges${qualityParam}`,
            {
              headers: {
                "x-db-choice": lang,
              },
            });
        const data = await res.json();
        setVestiges(data);
    };

    useEffect(() => {
        fetchVestiges();
    }, [selectedQuality]);

    const selectQuality = (qualityId: number) => {
        setSelectedQuality((prevSelectedQuality) =>
            prevSelectedQuality === qualityId ? null : qualityId
        );
    };

    const prefix = "sactx-0-2048x4096-ASTC 6x6-shenghen-";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white pb-20">
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
                                        className={`w-8 h-8 rounded-full m-1 border-2 ${selectedQuality === qualityId ? "border-[#82B0D6]" : "border-white/20"} ${qualityMapping[qualityId]} hover:border-[#82B0D6] transition-all`}
                                        onClick={() => selectQuality(qualityId)}
                                        title={qualityMapping[qualityId].replace("bg-", "").replace("-500", "")}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Grille des cartes */}
                <div className="w-full lg:w-3/4 lg:px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3">
                        {Vestiges.length === 0 ? (
                            <p className="text-center text-lg">Aucune carte trouvée</p>
                        ) : (
                            Vestiges.map((Vestige) => (
                                <a
                                    key={Vestige.id}
                                    href={`/vestiges/${Vestige.id}`}
                                    className="group block rounded-xl overflow-visible mb-1"
                                >
                                    <div className="relative w-full h-0 pb-[100%]">
                                        {/* Maintenir un aspect 1/1 avec la hauteur égale à la largeur */}
                                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                            <IconCanvas
                                                prefix={prefix}
                                                iconName={Vestige.pic}
                                                jsonDir="/images/atlas/shenghen/"
                                                canvasId={`canvas-${Vestige.id}`}
                                                imgHeight={4096}
                                                size={4}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-1 px-1">
                                        <h3 className="text-sm font-semibold text-white text-center leading-tight">
                                            {Vestige.name}
                                        </h3>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Bouton "Filtrer" mobile */}
            <div className="lg:hidden fixed bottom-4 left-0 right-0 flex justify-center z-40">
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="bg-[#82B0D6] text-[#0a091c] font-semibold py-2 px-6 rounded-full shadow-lg"
                >
                    Filtrer
                </button>
            </div>

            {/* Panneau de filtres mobile */}
            <div className={`fixed inset-0 bg-[#0a091c] z-50 overflow-y-auto p-6 transition-transform duration-300 ease-in-out ${showMobileFilters ? "translate-y-0" : "translate-y-full pointer-events-none"}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Filtres</h2>
                    <button
                        onClick={() => setShowMobileFilters(false)}
                        className="text-white text-sm border border-white/30 px-3 py-1 rounded"
                    >
                        Fermer
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Qualité</h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(qualityMapping).map((key) => {
                            const qualityId = Number(key);
                            return (
                                <button
                                    key={qualityId}
                                    className={`w-8 h-8 rounded-full border-2 ${selectedQuality === qualityId ? "border-[#82B0D6]" : "border-white/20"} ${qualityMapping[qualityId]} hover:border-[#82B0D6] transition-all`}
                                    onClick={() => selectQuality(qualityId)}
                                    title={qualityMapping[qualityId].replace("bg-", "").replace("-500", "")}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VestigesPage;