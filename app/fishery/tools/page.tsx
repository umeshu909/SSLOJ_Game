"use client";

import { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";
import { useTranslation } from "react-i18next";



const gradeColors: Record<string, string> = {
  Bleu: "text-blue-400",
  Violet: "text-purple-400",
  Or: "text-yellow-500",
  Rouge: "text-red-500",
  Platine: "text-gray-300",
};

export default function FishingToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Tool[]>>({});
  const { t } = useTranslation("common");

  type Tool = {
    Matériel: string;
    Grade: string;
    Niveaux: number;
    Coût: number;
    condition: string;
    icon: string;
  };

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "FR";

    fetch("/api/fishingTools", {
      headers: { "x-db-choice": lang },
    })
      .then((res) => res.json())
      .then((data: Tool[]) => {
        setTools(data);
        const groups = data.reduce((acc: Record<string, Tool[]>, tool) => {
          if (!acc[tool.Matériel]) acc[tool.Matériel] = [];
          acc[tool.Matériel].push(tool);
          return acc;
        }, {});
        setGrouped(groups);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("fishery.tool")}</h1>

      {Object.entries(grouped).map(([type, items], groupIndex) => (
        <div key={type} className="mb-10">
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-1">{t(`fishery.${type}`)}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="py-2 px-3">{t("fishery.icon")}</th>
                  <th className="py-2 px-3">{t("fishery.level")}</th>
                  <th className="py-2 px-3">{t("fishery.cost")}</th>
                  <th className="py-2 px-3">{t("fishery.condition")}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((tool, i) => {
                  const canvasId = `tool-${groupIndex}-${i}`;
                  return (
                    <tr key={canvasId} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-2 px-3">
                        {tool.icon && (
                          <IconCanvas
                            iconName={tool.icon}
                            canvasId={canvasId}
                            prefix="sactx-0-4096x4096-ASTC 6x6-icon_daojv-"
                            jsonDir="/images/atlas/icon_daojv/"
                            imgHeight={4096}
                            size={2}
                          />
                        )}
                      </td>
                      <td className="py-2 px-3">{tool.Niveaux}</td>
                      <td className="py-2 px-3">{tool.Coût}</td>
                      <td className="py-2 px-3">{tool.condition || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
