"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import IconCanvas from "@/components/IconCanvas";
import Description from "@/components/Description";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface VestigeDetail {
    id: number;
    name: string;
    pic: string;
    skillid: string;
    skillname: string;
    level: number;
    icon: string;
    desc: string;
    quality: number;
}

interface CareerValue {
    metier: number;
    metierText: string;
    times: number;
    Attrib1: string;
    value1: string;
    Attrib2: string;
    value2: string;
    Attrib3: string;
    value3: string;
    Attrib4: string | null;
    value4: string;
}

interface AllValue {
    AttribAll1: string;
    valueAll1: string;
    AttribAll2: string;
    valueAll2: string;
    AttribAll3: string;
    valueAll3: string;
}

const VestigeDetailPage = () => {
    const [details, setDetails] = useState<VestigeDetail[]>([]);
    const [careerValues, setCareerValues] = useState<CareerValue[]>([]);
    const [allValues, setAllValues] = useState<AllValue | null>(null);
    const [others, setOthers] = useState<VestigeDetail[]>([]);

    const { id } = useParams();
    const [level, setLevel] = useState<number>(30);
    const [quality, setQuality] = useState<number>(3);

    const prefix = "sactx-0-2048x4096-ASTC 6x6-shenghen-";
    const prefix2 = "sactx-0-4096x2048-ASTC 6x6-icon_jineng-";

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            const res = await fetch(`/api/vestiges/${id}`);
            const data = await res.json();
            setDetails(data);
            if (data.length > 0) setQuality(data[0].quality);
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (!id || !quality) return;

        const fetchValues = async () => {
            const res1 = await fetch(`/api/vestiges/${id}/values?level=${level}`);
            const res2 = await fetch(`/api/vestiges/${id}/valuesall?level=${level}&quality=${quality}`);
            setCareerValues(await res1.json());
            const all = await res2.json();
            setAllValues(all[0]);
        };

        fetchValues();
    }, [id, level, quality]);

    useEffect(() => {
        const fetchOthers = async () => {
            const res = await fetch("/api/vestiges");
            const all = await res.json();
            const filtered = all.filter((v: VestigeDetail) => v.id !== Number(id) && v.quality === quality);
            setOthers(filtered);
        };
        if (quality) fetchOthers();
    }, [quality]);

    if (details.length === 0) {
        return <p className="text-white">Chargement...</p>;
    }

    const main = details[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white p-6">
            <div className="max-w-screen-lg mx-auto bg-[#14122a] rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
                {/* Image + infos principales */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-[220px] aspect-[3/4]">
                        <IconCanvas
                            prefix={prefix}
                            iconName={main.pic}
                            jsonDir="/images/atlas/shenghen/"
                            canvasId={`canvas-${id}`}
                            imgHeight={4096}
                            size={3}
                        />
                    </div>
                    <h2 className="text-xl font-semibold text-center">{main.name}</h2>

                    <p className="text-xs text-white/60 mt-1">Sélectionner le niveau</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {[5, 10, 15, 20, 25, 30].map((lvl) => (
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
                        {[...new Set(details.map((d) => d.skillid))].map((skillid, i) => {
                            const group = details.filter((d) => d.skillid === skillid);
                            const skill = group[0];
                            return (
                                <div key={i} className="mb-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <IconCanvas
                                            prefix={prefix2}
                                            iconName={skill.icon}
                                            jsonDir="/images/atlas/icon_jineng/"
                                            canvasId={`canvas-skill-${skillid}`}
                                            imgHeight={2048}
                                            size={2}
                                        />
                                        <h3 className="text-lg font-semibold">{skill.skillname}</h3>
                                    </div>
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {group.map((g, j) => (
                                                <tr key={j}>
                                                    <td className="ppy-1 pr-4 min-w-[80px] font-semibold text-white/80 align-top">Niv {g.level}</td>
                                                    <td className="py-1">
                                                        <Description text={g.desc} dbChoice="FR" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                    </div>


                    {/* Stats */}
                    <div className="bg-[#1d1b35] border border-white/10 rounded-lg p-4 text-sm flex flex-wrap gap-6 justify-center">
                        {careerValues.map((cv, idx) => (
                            <div key={idx} className="min-w-[120px]">
                                <h4 className="text-white font-semibold text-center mb-1">{cv.metierText}</h4>
                                <ul className="text-xs text-white/80">
                                    {cv.Attrib1 && <li>{cv.Attrib1.trim()}: {cv.value1}</li>}
                                    {cv.Attrib2 && <li>{cv.Attrib2.trim()}: {cv.value2}</li>}
                                    {cv.Attrib3 && <li>{cv.Attrib3.trim()}: {cv.value3}</li>}
                                    {cv.Attrib4 && <li>{cv.Attrib4.trim()}: {cv.value4}</li>}
                                </ul>
                            </div>
                        ))}
                        {allValues && (
                            <div className="min-w-[120px]">
                                <h4 className="text-white font-semibold text-center mb-1">Commun</h4>
                                <ul className="text-xs text-white/80">
                                    <li>{allValues.AttribAll1.trim()}: {allValues.valueAll1}</li>
                                    <li>{allValues.AttribAll2.trim()}: {allValues.valueAll2}</li>
                                    <li>{allValues.AttribAll3.trim()}: {allValues.valueAll3}</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Autres vestiges */}
            {others.length > 0 && (
                <div className="max-w-screen-lg mx-auto mt-12">
                    <h3 className="text-xl font-bold mb-4 text-center">Autres vestiges</h3>
                    <Swiper
                        spaceBetween={16}
                        slidesPerView={2}
                        breakpoints={{
                            640: { slidesPerView: 4 },
                            1024: { slidesPerView: 6 }
                        }}
                    >
                        {others.map((v) => (
                            <SwiperSlide key={v.id}>
                                <a href={`/vestiges/${v.id}`} className="block relative w-full aspect-[3/4] rounded-xl overflow-hidden">
                                      <IconCanvas
                                        prefix={prefix}
                                        iconName={v.pic}
                                        jsonDir="/images/atlas/shenghen/"
                                        canvasId={`preview-${v.id}`}
                                        imgHeight={4096}
                                        size={4}
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

export default VestigeDetailPage;
