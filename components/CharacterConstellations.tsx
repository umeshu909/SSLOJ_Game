import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import IconCanvas from "@/components/IconCanvas";
import Description from "@/components/Description";
import { useTranslation } from 'next-i18next'

interface ConstellationSkill {
  skillName: string;
  skillId: number;
  level: number;
  skillDescription: string;
  suitNeed: number;
  icon: string;
}

interface Constellation {
  overname: string;
  icon: string;
  skills: ConstellationSkill[];
}

const ConstellationsPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [constellationData, setConstellationData] = useState<Constellation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lang, setLang] = useState<string | null>(null);
  const { t } = useTranslation("common");

  const prefix = "sactx-0-4096x2048-ASTC 6x6-icon_jineng-";

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "FR";
    setLang(storedLang);
  }, []);

  useEffect(() => {
    if (!id || !lang) return;

    const fetchConstellations = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/characters/${id}/constellations`, {
          headers: {
            "x-db-choice": lang,
          },
        });

        if (!res.ok) {
          throw new Error(t("errors.noConstellation"));
        }

        const data = await res.json();
        setConstellationData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConstellations();
  }, [id, lang]);

  const renderSuitNeedImages = (suitNeed: number) => {
    const yellowImages = [];
    const redImages = [];

    if (suitNeed === 3) {
      for (let i = 0; i < 3; i++) {
        redImages.push(
          <img
            key={`red-${i}`}
            src="/images/const-active.png"
            alt="Red Constellation"
            className="object-contain"
          />
        );
      }
      for (let i = 0; i < 6; i++) {
        yellowImages.push(
          <img
            key={`yellow-${i}`}
            src="/images/const-inactive.png"
            alt="Yellow Constellation"
            className="object-contain"
          />
        );
      }
    } else if (suitNeed === 9) {
      for (let i = 0; i < 9; i++) {
        redImages.push(
          <img
            key={`red-${i}`}
            src="/images/const-active.png"
            alt="Red Constellation"
            className="object-contain"
          />
        );
      }
    }

    return (
      <div className="flex space-x-1 mb-4 justify-center">
        {redImages}
        {yellowImages}
      </div>
    );
  };

  if (loading) return <div>{t("interface.loading")}</div>;

  if (error) {
    return (
      <h2 className="text-xl font-semibold text-white mb-2 text-center">
        {error}
      </h2>
    );
  }

  return (
    <section className="lg:p-6">
      <h2 className="text-xl font-semibold text-white mb-2">{t("interface.constellation")}</h2>
      <div className="overflow-hidden">
        {constellationData?.skills && constellationData.skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {constellationData.skills.map((skill, index) => (
              <div key={index} className="flex flex-col bg-white/5 p-6 border border-white/20 rounded-xl items-center justify-center">
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="mb-2">
                    <IconCanvas
                      prefix={prefix}
                      iconName={skill.icon}
                      jsonDir="/images/atlas/icon_jineng/"
                      canvasId={`canvas-${index}`}
                      imgHeight={2048}
                      size={1}
                    />
                  </div>
                  <h3 className="text-white text-center text-m font-semibold">{skill.skillName}</h3>
                </div>

                {renderSuitNeedImages(skill.suitNeed)}

                <div className="flex-1 flex flex-col justify-between text-center md:text-left">
                  <div className="mt-2 text-sm text-white">
                    <Description skillId={skill.skillId} level={skill.level} dbChoice={lang} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold">{error}</h2>
          </div>

        )}
      </div>
    </section>
  );
};

export default ConstellationsPage;
