"use client";
import { useEffect, useState, useMemo } from "react";
import IconCanvas from "@/components/IconCanvas";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import Link from "next/link";

type TimelineItem = {
  id: number;
  date: string;
  version: "CN" | "JP" | "GLO";
  icon: string | null;
  name: string | null;
  firstname: string | null;
  lastname: string | null;
  type: string | null;
};

const typeIconMapping = {
  Sablier: "sds_aodexiusi_shikongzhixi",
  Petale: "sds_huaban_fen",
  p2w: "sds_cishanmujuan_wp",
  Stellaire: "sds_migongbi_icon",
  Fleche: "sds_xindoushiup_wp",
  Bouclier: "sds_xindoushiup_dun_wp"
};

const TimelinePage = () => {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<"ALL" | "GLO" | "CN" | "JP">("ALL");
  const [search, setSearch] = useState("");

  const fetchTimeline = async () => {
    const res = await fetch(`/api/timeline/${selectedVersion}`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchTimeline();
  }, [selectedVersion]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      [item.name, item.firstname, item.lastname]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query))
    );
  }, [search, items]);

  const versionLabels = {
    ALL: "Tous",
    GLO: "Global",
    CN: "Chine",
    JP: "Japon",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a091c] via-[#1a183a] to-[#0e0c1e] text-white">
      <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 pb-6 pt-[12px] gap-6">
        {/* Sidebar de filtre pour desktop */}
        <div className="hidden lg:flex flex-col w-[320px] sticky top-[132px] h-fit bg-[#14122a] p-6 text-white">
          {/* Champ de recherche */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Rechercher un personnage..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1e1c3a] border border-white/10 placeholder-white/40 text-white"
            />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Versions</h2>
          <div className="flex flex-col gap-2">
            {(["ALL", "GLO", "CN", "JP"] as const).map((version) => (
              <button
                key={version}
                onClick={() => setSelectedVersion(version)}
                className={`px-4 py-2 rounded-md text-sm text-left border ${
                  selectedVersion === version
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                }`}
              >
                {versionLabels[version]}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="w-full lg:flex-1 px-4">
          {/* Pour mobile, on affiche un champ de recherche en haut */}
          <div className="lg:hidden mb-4">
            <input
              type="text"
              placeholder="Rechercher un personnage..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1e1c3a] border border-white/10 placeholder-white/40 text-white"
            />
          </div>

          <VerticalTimeline>
            {filteredItems.map((item, index) => (
              <VerticalTimelineElement
                key={index}
                date=""
                iconStyle={{
                  background: "transparent",
                  boxShadow: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
                icon={
                  <Link href={`/characters/${item.id}`}>
                    {item.icon ? (
                      <IconCanvas
                        prefix="sactx-0-4096x2048-ASTC 6x6-icon_touxiang-"
                        iconName={item.icon}
                        jsonDir="/images/atlas/icon_touxiang/"
                        canvasId={`timeline-canvas-${item.id}-${index}`}
                        imgHeight={2048}
                        size={2}
                      />
                    ) : (
                      <div className="text-xs bg-white text-black rounded-full p-2">?</div>
                    )}
                  </Link>
                }
                contentStyle={{ background: "#2C2F58", color: "#fff" }}
                contentArrowStyle={{ borderRight: "7px solid #2C2F58" }}
              >

                {item.type && typeIconMapping[item.type] && (
                  <div className="absolute top-2 right-2">
                    <IconCanvas
                      prefix="sactx-0-4096x4096-ASTC 6x6-icon_daojv-"
                      iconName={typeIconMapping[item.type]}
                      jsonDir="/images/atlas/icon_daojv/"
                      canvasId={`canvas-type-${item.id}`}
                      imgHeight={4096}
                      size={2}
                    />
                  </div>
                )}

                <h4 className="text-lg font-semibold mb-1">
                  {item.name || ""}
                </h4>
                <p className="text-xs text-white/80">
                  <b>Date ({item.version})</b> : {item.date}
                </p>
  
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
          
        </div>
      </div>

      {/* Filtre mobile fixé en bas */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a091c] border-t border-white/10 shadow-md p-4">
        <p className="text-center text-sm text-white/60 mb-2">Versions</p>
        <div className="flex flex-wrap justify-center gap-1 text-xs">
          {(["ALL", "GLO", "CN", "JP"] as const).map((version) => (
            <button
              key={version}
              onClick={() => setSelectedVersion(version)}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedVersion === version
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {versionLabels[version]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
