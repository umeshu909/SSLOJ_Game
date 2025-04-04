"use client";
import { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";

interface Statues {
    id: number;
    name: string;
    icon: string;
}

const StatuessPage = () => {
    const [Statuess, setStatuess] = useState<Statues[]>([]);

    const fetchStatuess = async () => {
        const lang = localStorage.getItem("lang") || "FR";
        const res = await fetch(`/api/statues`, {
            headers: {
                "x-db-choice": lang,
            },
        });
        const data = await res.json();
        setStatuess(data);
    };

    useEffect(() => {
        fetchStatuess();
    }, []);

    const prefix = "sactx-0-1024x2048-ASTC 6x6-jiaotang-";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white">
            <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-6">
                {/* Grille des cartes */}
                <div className="w-full lg:w-3/4 px-6">
                    {Statuess.length === 0 ? (
                        <p className="text-center text-lg">Aucune statue trouvée</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
                            {Statuess.map((Statues, index) => (
                                <a
                                    key={Statues.id}
                                    href={`/statues/${Statues.id}`}
                                    className="group bg-[#1e1c3a] border border-white/10 hover:border-white/30 rounded- p-3 flex flex-col items-center text-center transition duration-200 hover:scale-[1.02]"
                                >
                                    {/* Carte avec ratio fixe */}
                                    <div className="relative w-full aspect-[3/4] flex items-center justify-center">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <IconCanvas
                                                prefix={prefix}
                                                iconName={Statues.icon}
                                                jsonDir="/images/atlas/jiaotang/"
                                                canvasId={`canvas-${index}`}
                                                imgHeight={2048}
                                                size={1.5}
                                            />
                                        </div>
                                    </div>

                                    {/* Nom de la statue */}
                                    <h3
                                        className="mt-3 text-xs font-semibold text-white leading-tight text-center w-full max-w-full"
                                        title={Statues.name}
                                    >
                                        {Statues.name}
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

export default StatuessPage;
