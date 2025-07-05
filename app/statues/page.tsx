"use client";
import { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";
import { useTranslation } from "react-i18next";

interface Statues {
  id: number;
  name: string;
  icon: string;
  hero1_icon?: string;
  hero2_icon?: string;
  hero3_icon?: string;
  hero4_icon?: string;
  hero5_icon?: string;
  hero1_id?: number;
  hero2_id?: number;
  hero3_id?: number;
  hero4_id?: number;
  hero5_id?: number;
}


const StatuessPage = () => {
    const [Statuess, setStatuess] = useState<Statues[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const { t } = useTranslation("common");

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
      const checkMobile = () => setIsMobile(window.innerWidth < 840);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        fetchStatuess();
    }, []);

    const prefix = "sactx-0-1024x2048-ASTC 6x6-jiaotang-";
    const prefixCharacter = "sactx-0-4096x2048-ASTC 6x6-icon_touxiang-";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white">
            <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-6 justify-center">
                {/* Grille des cartes */}
                <div className="w-full lg:w-3/4 px-6">
                    {Statuess.length === 0 ? (
                        <p className="text-center text-lg">{t("errors.noStatues")}</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                            {Statuess.map((Statues, index) => (

                            <a
                              key={Statues.id}
                              href={`/statues/${Statues.id}`}
                              className="group bg-[#1e1c3a] border border-white/10 hover:border-white/30 rounded p-2 flex flex-col items-center text-center transition duration-200 hover:scale-[1.01]"
                            >
                              <div className="flex flex-col justify-between flex-grow h-full items-center">
                                {/* Partie haute : image + titre */}
                                <div className="w-full flex flex-col items-center">

                                 <div className="relative w-full aspect-[2/3] max-h-32 flex items-center justify-center">
                                    {/* Image de fond */}
                                    <img
                                      src="/images/bg_statues_final.png"
                                      alt="Background statue"
                                      className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0 scale-170 translate-x-1.5 translate-y-5.5"
                                    />



                                    {/* Image de la statue par-dessus */}
                                    <div className="relative z-10 translate-x-0.5 translate-y-5">
                                    <IconCanvas
                                      prefix={prefix}
                                      iconName={Statues.icon}
                                      jsonDir="/images/atlas/jiaotang/"
                                      canvasId={`canvas-${index}`}
                                      imgHeight={2048}
                                      size={2}
                                    />
                                    </div>
                                </div>

                                <h4
                                  className="relative z-20 mt-3 text-[10px] font-semibold translate-y-0.5 text-white leading-tight text-center w-full max-w-full h-[2.75rem] overflow-hidden"
                                  title={Statues.name}
                                >
                                  {Statues.name}
                                </h4>

                                </div>

                                {/* Partie basse : portraits */}
                                <div className="border-t border-white/10 mt-2 pt-2 w-full flex rounded-none justify-center gap-1">
                                    {[
                                      { icon: Statues.hero1_icon, id: Statues.hero1_id },
                                      { icon: Statues.hero2_icon, id: Statues.hero2_id },
                                      { icon: Statues.hero3_icon, id: Statues.hero3_id },
                                      { icon: Statues.hero4_icon, id: Statues.hero4_id },
                                      { icon: Statues.hero5_icon, id: Statues.hero5_id },
                                    ]
                                      .filter(({ icon }) => !!icon)
                                      .map(({ icon, id }, i) => (
                                        <IconCanvas
                                          key={i}
                                          prefix={prefixCharacter}
                                          iconName={icon!}
                                          jsonDir="/images/atlas/icon_touxiang/"
                                          canvasId={`canvas-statue-hero-${Statues.id}-${i}`}
                                          imgHeight={2048}
                                          size={isMobile ? 5 : 3.5}
                                          id={id?.toString()} // au cas où l'id est numérique
                                        />
                                    ))}

                                </div>
                              </div>
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
