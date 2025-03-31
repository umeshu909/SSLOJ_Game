"use client";
import { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";

interface Statues {
    id: number;
    name: string;
    icon: string;
}

/*const qualityMapping: Record<number, string> = {
    3: "bg-purple-500",
    4: "bg-yellow-500",
};*/

const StatuessPage = () => {
    const [Statuess, setStatuess] = useState<Statues[]>([]);
    //const [selectedQuality, setSelectedQuality] = useState<number | null>(null);

    const fetchStatuess = async () => {
        //const qualityParam = selectedQuality !== null ? `?quality=${selectedQuality}` : "";
        const res = await fetch(`/api/statues`);
        const data = await res.json();
        setStatuess(data);
    };

    useEffect(() => {
        fetchStatuess();
    }, []);


   /* const selectQuality = (qualityId: number) => {
        setSelectedQuality((prevSelectedQuality) =>
            prevSelectedQuality === qualityId ? null : qualityId
        );
    };*/


    const prefix = "sactx-0-1024x2048-ASTC 6x6-jiaotang-";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white">
            <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-6">
               
                {/* Grille des cartes */}
                <div className="w-full lg:w-3/4 px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-2">
                        {Statuess.length === 0 ? (
                            <p className="text-center text-lg">Aucune statue trouvée</p>
                        ) : (
                            Statuess.map((Statues, index) => (
                                <a
                                    key={Statues.id}
                                    href={`/statues/${Statues.id}`}
                                    className="group block rounded-xl overflow-visible"
                                >
                                    {/* Carte avec ratio fixe */}
                                    <div className="relative w-full aspect-[3/4]">
                                        {/* Image du personnage centrée */}
                                        <div className="absolute top-1/2 left-1/2 w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2 z-0">
                                            <IconCanvas
                                              prefix={prefix}
                                              iconName={Statues.icon}
                                              jsonDir="/images/atlas/jiaotang/"
                                              canvasId={`canvas-${index}`}
                                              imgHeight={2048}
                                              size={1}
                                            />
                                        </div>
                                    </div>

                                    {/* Nom du personnage */}
                                    <div className="mt-1 px-1">
                                        <h3 className="text-md font-semibold text-white text-center leading-tight">
                                            {Statues.name}
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

export default StatuessPage;