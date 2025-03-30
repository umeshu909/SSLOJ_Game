"use client";
import { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";

interface Artifact {
    id: number;
    name: string;
    icon: string;
    quality: string;
}

const qualityMapping: Record<number, string> = {
    0: "Normaux",
    1: "Pros",
};

const ArtifactsPage = () => {
    const [Artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [selectedQuality, setSelectedQuality] = useState<number | null>(null);

    const fetchArtifacts = async () => {
        const qualityParam = selectedQuality !== null ? `?quality=${selectedQuality}` : "";
        const res = await fetch(`/api/artifacts${qualityParam}`);
        const data = await res.json();
        setArtifacts(data);
    };

    useEffect(() => {
        fetchArtifacts();
    }, [selectedQuality]);

    const selectQuality = (qualityId: number) => {
        setSelectedQuality((prevSelectedQuality) =>
            prevSelectedQuality === qualityId ? null : qualityId
        );
    };


    const prefix = "sactx-0-4096x4096-ASTC 6x6-icon_daojv-";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white">
            <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-6">
                {/* Sidebar des filtres */}
                <div className="hidden lg:flex flex-col w-[320px] sticky top-[68px] h-fit bg-[#14122a] rounded-xl p-6 text-white">
                    <h2 className="text-2xl font-semibold mb-4">Filtres</h2>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Qualité</h3>
                        <div className="flex flex-col gap-2">
                            {Object.entries(qualityMapping).map(([key, label]) => {
                                const qualityId = Number(key);
                                const isSelected = selectedQuality === qualityId;
                                return (
                                    <button
                                        key={qualityId}
                                        onClick={() => selectQuality(qualityId)}
                                        className={`px-4 py-2 rounded-md text-sm text-left border ${
                                            isSelected ? "bg-blue-600 text-white border-blue-500" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                    </div>
                </div>

                {/* Grille des cartes */}
                <div className="w-full lg:w-3/4 px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-2">
                        {Artifacts.length === 0 ? (
                            <p className="text-center text-lg">Aucun artefact trouvé</p>
                        ) : (
                            Artifacts.map((Artifact, index) => (
                                <a
                                    key={Artifact.id}
                                    href={`/artefacts/${Artifact.id}`}
                                    className="group block rounded-xl overflow-visible"
                                >
                                    {/* Carte avec ratio fixe */}
                                    <div className="relative w-full aspect-[3/4]">

                                      <img
                                        src={Artifact.icon}
                                        alt={Artifact.name}
                                        className="relative z-10 w-full h-auto object-contain transition-transform duration-500 group-hover:scale-102"
                                      />

                                    </div>

                                    {/* Nom du personnage */}
                                    <div className="mt-1 px-1">
                                        <h3 className="text-md font-semibold text-white text-center leading-tight">
                                            {Artifact.name} 
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

export default ArtifactsPage;