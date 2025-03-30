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

    const fetchVestiges = async () => {
        const qualityParam = selectedQuality !== null ? `?quality=${selectedQuality}` : "";
        const res = await fetch(`/api/vestiges${qualityParam}`);
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
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white">
            <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-6">
                {/* Sidebar des filtres */}
                <div className="hidden lg:flex flex-col w-[320px] sticky top-[68px] h-fit bg-[#14122a] rounded-xl p-6 text-white">
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-2">
                        {Vestiges.length === 0 ? (
                            <p className="text-center text-lg">Aucune carte trouvée</p>
                        ) : (
                            Vestiges.map((Vestige, index) => (
                                <a
                                    key={Vestige.id}
                                    href={`/vestiges/${Vestige.id}`}
                                    className="group block rounded-xl overflow-visible"
                                >
                                    {/* Carte avec ratio fixe */}
                                    <div className="relative w-full aspect-[3/4]">
                                        {/* Image du personnage centrée */}
                                        <div className="absolute top-1/2 left-1/2 w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2 z-0">
                                            <IconCanvas
                                              prefix={prefix}
                                              iconName={Vestige.pic}
                                              jsonDir="/images/atlas/shenghen/"
                                              canvasId={`canvas-${index}`}
                                              imgHeight={4096}
                                              size={4}
                                            />
                                        </div>
                                    </div>

                                    {/* Nom du personnage */}
                                    <div className="mt-1 px-1">
                                        <h3 className="text-md font-semibold text-white text-center leading-tight">
                                            {Vestige.name}
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

export default VestigesPage;