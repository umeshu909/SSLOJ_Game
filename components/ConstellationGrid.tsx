import React, { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";
import { useTranslation } from "next-i18next";

interface PropData {
  id: number;
  name: string;
  percent: number;
  base: number;
  grow: number;
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
  const [mode, setMode] = useState<"C9" | "C36">("C9");

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

      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 md:p-6">


        {/* Switch C9 / C36 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex border border-white/20 rounded overflow-hidden">
            <button
              onClick={() => setMode("C9")}
              className={`px-4 py-1 text-sm ${
                mode === "C9" ? "bg-white text-black font-semibold" : "text-white bg-transparent"
              }`}
            >
              C9
            </button>
            <button
              onClick={() => setMode("C36")}
              className={`px-4 py-1 text-sm ${
                mode === "C36" ? "bg-white text-black font-semibold" : "text-white bg-transparent"
              }`}
            >
              C36
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/20 rounded-xl p-4 flex items-center gap-4"
            >
              {/* Icône à gauche, centrée verticalement */}
              <div className="flex-shrink-0">
                <IconCanvas
                  prefix={prefix}
                  iconName={item.icon}
                  jsonDir="/images/atlas/xingzuo/"
                  canvasId={`canvas-${index}`}
                  imgHeight={2048}
                  size={2.5}
                />
              </div>

              {/* Infos à droite de l'icône */}
              <div className="w-full text-sm text-white space-y-2">
                <div className="flex justify-between text-center font-medium text-gray-400">
                  {item.props.map((prop, i) => (
                    <div key={`label-${i}`} className="w-1/3">{prop.name}</div>
                  ))}
                </div>
                <div className="flex justify-between text-center">
                  {item.props.map((prop, i) => (
                    <div key={`value-${i}`} className="w-1/3">
                      {(() => {
                        let value = prop.base;
                        if (prop.grow > 0 && mode === "C36") {
                          value += 3 * prop.grow;
                        }
                        return prop.percent === 1
                          ? `${(value * 100).toFixed(2)}%`
                          : `${value.toFixed(1)}`;
                      })()}

                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

};

export default ConstellationGrid;
