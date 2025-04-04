"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Description from "@/components/Description";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ArrowLeft } from "lucide-react";

interface ArtifactDetail {
    id: number;
    name: string;
    icon: string;
    level: number;
    Attrib1: string;
    value1: string;
    Attrib2: string;
    value2: string;
    Attrib3: string;
    value3: string;
    skill1: string;
    skill2: string;
    skill3: string;
    quality: number;
}


const ArtifactDetailPage = () => {
    const { id } = useParams();
    const [artifact, setArtifact] = useState<ArtifactDetail | null>(null);
    const [others, setOthers] = useState<ArtifactDetail[]>([]);
    const [level, setLevel] = useState<number>(1);
    const [quality, setQuality] = useState<number>(0);
    const [lang, setLang] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const storedLang = localStorage.getItem("lang") || "FR";
        setLang(storedLang);
    }, []);


    useEffect(() => {
        if (!id || !lang) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/artifacts/${id}?level=${level}`,
                {
                  headers: {
                    "x-db-choice": lang,
                  },
                });

                if (!res.ok) {
                    setNotFound(true);
                    setArtifact(null);
                    return;
                }

                const data = await res.json();
                setArtifact(data);
                setNotFound(false); // tout va bien
                if (data.length > 0) setQuality(parseInt(data[0].quality));
            } catch (error) {
                console.error("Erreur lors de la récupération du détail:", error);
                setNotFound(true);
                setArtifact(null);
            }

        };

        fetchData();
    }, [id, level, lang]);

    useEffect(() => {
        if (!artifact) return;

        const fetchOthers = async () => {
            const res = await fetch("/api/artifacts",
            {
              headers: {
                "x-db-choice": lang,
              },
            });
            const all = await res.json();

            const filtered = all.filter((a: ArtifactDetail) => 
                a.id !== Number(id) &&
                String(a.quality) === String(artifact.quality)
            );

            setOthers(filtered);
        };

        fetchOthers();
    }, [artifact]);

    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center text-white p-6">
                {/* TEXTE D'INFORMATION */}
                <p className="text-lg mt-4">
                    Cet artefact n’est pas disponible dans la base de données sélectionnée.
                </p>
            </div>
        );
    }

    if (!artifact || !lang) {
        return <p className="text-white">Chargement...</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white p-6">
            <div className="max-w-screen-lg mx-auto bg-[#14122a] rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
                {/* Image + nom */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-[220px] aspect-[3/4]">
                        <img
                            src={artifact.icon}
                            alt={artifact.name}
                            className="relative z-10 w-full h-auto object-contain transition-transform duration-500 group-hover:scale-102"
                        />
                    </div>
                    <h2 className="text-xl font-semibold text-center">{artifact.name}</h2>
                    <p className="text-xs text-white/60 mt-1">Sélectionner le niveau</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                                key={lvl}
                                onClick={() => setLevel(lvl)}
                                className={`px-3 py-1 text-sm rounded-md shadow-md transition-all duration-150 ${
                                    level === lvl ? "bg-blue-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
                                }`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description + Skills */}
                <div className="flex-1 flex flex-col justify-between gap-6 pt-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Compétence 1</h3>
                        <div className="text-md"><Description text={artifact.skill1} dbChoice={lang} /></div>
                        <h3 className="text-lg font-semibold mt-4 mb-2">Compétence 2</h3>
                        <div className="text-md"><Description text={artifact.skill2} dbChoice={lang} /></div>
                        <h3 className="text-lg font-semibold mt-4 mb-2">Compétence 3</h3>
                        <div className="text-md"><Description text={artifact.skill3} dbChoice={lang} /></div>
                    </div>

                    {/* Stats */}
                    <div className="bg-[#1d1b35] border border-white/10 rounded-lg p-4 text-sm flex flex-wrap gap-6 justify-center">
                        <div className="min-w-[120px]">
                            <ul className="text-xs text-white/80">
                                {artifact.Attrib1 && <li>{artifact.Attrib1.trim()}: {artifact.value1}</li>}
                                {artifact.Attrib2 && <li>{artifact.Attrib2.trim()}: {artifact.value2}</li>}
                                {artifact.Attrib3 && <li>{artifact.Attrib3.trim()}: {artifact.value3}</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Autres artefacts */}
            {others.length > 0 && (
                <div className="max-w-screen-lg mx-auto mt-12">
                    <h3 className="text-xl font-bold mb-4 text-center">Autres artefacts</h3>
                    <Swiper
                        spaceBetween={16}
                        slidesPerView={2}
                        breakpoints={{
                            640: { slidesPerView: 4 },
                            1024: { slidesPerView: 6 }
                        }}
                    >
                        {others.map((a) => (
                            <SwiperSlide key={a.id}>
                                <a href={`/artefacts/${a.id}`} className="block relative w-full aspect-[3/4] rounded-xl overflow-hidden">
                                    <img
                                        src={a.icon}
                                        alt={a.name}
                                        className="w-full h-full object-contain"
                                    />
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
};

export default ArtifactDetailPage;
