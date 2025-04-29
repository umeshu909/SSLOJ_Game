"use client";

import { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";

export default function AllItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const dbChoice = typeof window !== "undefined" ? localStorage.getItem("lang") || "FR" : "FR";

  useEffect(() => {
    fetch("/api/items/all", {
      headers: {
        "x-db-choice": dbChoice,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement items:", err);
        setLoading(false);
      });
  }, [dbChoice]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Tous les objets disponibles</h1>
      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : items.length === 0 ? (
        <p className="text-center">Aucun objet trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={index} className="bg-[#1f1d3a] p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                {item.icon && (
                  <div className="w-10 h-10 flex items-center justify-center">
                    <IconCanvas
                      prefix="sactx-0-4096x4096-ASTC 6x6-icon_daojv-"
                      iconName={item.icon}
                      jsonDir="/images/atlas/icon_daojv/"
                      canvasId={`canvas-item-${index}`}
                      imgHeight={4096}
                      size={2}
                    />
                  </div>
                )}
                <h3 className="text-yellow-300 text-sm font-semibold break-words flex-1">{item.name}</h3>
              </div>
              <p className="text-xs text-white/70 mt-2 whitespace-pre-wrap break-words line-clamp-3">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
