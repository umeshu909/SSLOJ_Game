import React, { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";
import { useTranslation } from "next-i18next";

interface PropData {
  id: number;
  name: string;
  percent: number;
  base: number;
}

interface ConstellationItem {
  id: number;
  name: string;
  quality: number;
  icon: string;
  props: PropData[];
}

interface ConstellationGridProps {
  id: string;
}

const ConstellationGrid = ({ id }: ConstellationGridProps) => {

  const [data, setData] = useState<ConstellationItem[]>([]);
  const [lang, setLang] = useState<string>("FR");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation("common");

  const prefix = "sactx-0-2048x2048-ASTC 6x6-xingzuo-";

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "FR";
    setLang(storedLang);
  }, []);

  useEffect(() => {
    if (!id || !lang) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/characters/${id}/constellationsDetails`, {
          headers: { "x-db-choice": lang }
        });

        if (!res.ok) throw new Error("");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, lang]);

  if (loading) return <div>{t("interface.loading")}</div>;
  if (error) return <div className="text-white text-center">{error}</div>;

  return (
    <section className="mt-4 md:mt-0 lg:p-6">

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">

        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/20 rounded-xl p-4 flex flex-col items-center"
          >
            <h3 className="hidden md:block text-white text-center text-sm font-semibold mt-2 mb-4">
              {item.name}
            </h3>


            <IconCanvas
              prefix={prefix}
              iconName={item.icon}
              jsonDir="/images/atlas/xingzuo/"
              canvasId={`canvas-${index}`}
              imgHeight={2048}
              size={3}
            />


            <div className="w-full text-sm text-white space-y-2">
              {item.props.map((prop, i) => (
                <div key={i} className="flex justify-between border-b border-white/10 pb-1">
                  <div className="font-medium">{prop.name}</div>
                  <div className="text-right">
                    {prop.percent === 1
                      ? `+${(prop.base * 100).toFixed(2)}%`
                      : `+${prop.base.toFixed(1)}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ConstellationGrid;
