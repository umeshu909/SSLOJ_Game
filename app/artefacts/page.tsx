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
        const lang = localStorage.getItem("lang") || "FR";
        const res = await fetch(`/api/artifacts${qualityParam}`, {
            headers: {
                "x-db-choice": lang,
            },
        });
        const data = await res.json();
        setArtifacts(data);
    };

    useEffect(() => {
        fetchArtifacts();
    }, [selectedQuality]);

    const selectQuality = (qualityId: number) => {
        setSelectedQuality((prev) => (prev === qualityId ? null : qualityId));
    };

    const prefix = "sactx-0-4096x4096-ASTC 6x6-icon_daojv-";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white">
            <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 pb-6 pt-[12px]">
                {/* Sidebar des filtres */}
                <div className="hidden lg:flex flex-col w-[320px] sticky top-[132px] h-fit bg-[#14122a] rounded p-6 text-white">
                    <h2 className="text-xl font-semibold mb-4">Filtres</h2>

                    <div className="mt-6">
                        <h3 className="text-xs uppercase font-medium mb-3 text-white/80">Qualité</h3>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(qualityMapping).map(([key, label]) => {
                                const qualityId = Number(key);
                                const isSelected = selectedQuality === qualityId;
                                return (
                                    <button
                                        key={qualityId}
                                        onClick={() => selectQuality(qualityId)}
                                        className={`w-fit px-4 py-2 rounded text-sm text-left border rounded-full ${isSelected
                                            ? "text-white bg-purple-300/15 border-white/80"
                                            : "text-white/70 bg-transparent border-white/40"
                                        } hover:text-white hover:border-white transition-all`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Grille des artefacts */}
                <div className="w-full lg:w-3/4 px-6">
                    {Artifacts.length === 0 ? (
                        <p className="text-center text-lg mt-4">Aucun artefact trouvé</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {Artifacts.map((artifact) => (
                                <a
                                    key={artifact.id}
                                    href={`/artefacts/${artifact.id}`}
                                    className="group bg-[#1e1c3a] border border-white/10 hover:border-white/30 rounded p-3 flex flex-col items-center text-center transition duration-200 hover:scale-[1.01]"
                                >
                                    <div className="relative w-full aspect-[3/4] flex items-center justify-center">
                                        <img
                                            src={artifact.icon}
                                            alt={artifact.name}
                                            className="w-full h-auto object-contain z-10"
                                        />
                                    </div>
                                    <h3 className="mt-3 text-sm font-semibold text-white leading-tight">
                                        {artifact.name}
                                    </h3>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtifactsPage;