"use client";

import { useEffect, useState } from "react";
import IconCanvas from "@/components/IconCanvas";

export default function ShopItemsPage() {
  const [shops, setShops] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [loadingItems, setLoadingItems] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const dbChoice = typeof window !== "undefined" ? localStorage.getItem("lang") || "FR" : "FR";

  const getTranslatedShopLabel = (label: string) => {
    if (label === "遺跡商店") return "Reliques 1";
    if (label === "秘寶商店") return "Reliques 2";
    if (label === "对决之战") return null;
    return label;
  };

  const currentShopLabel = getTranslatedShopLabel(
    shops.find((s) => s.currencyid === selectedShopId)?.label || ""
  );

  useEffect(() => {
    fetch("/api/shop/list", {
      headers: { "x-db-choice": dbChoice },
    })
      .then((res) => res.json())
      .then((data) => {
        setShops(data);
        if (data.length > 0) {
          setSelectedShopId(data[0].currencyid);
        }
      })
      .catch((err) => console.error("Erreur chargement shops:", err));
  }, [dbChoice]);

  useEffect(() => {
    if (selectedShopId !== null) {
      setLoadingItems(true);
      fetch(`/api/shop/items/${selectedShopId}`, {
        headers: { "x-db-choice": dbChoice },
      })
        .then((res) => res.json())
        .then((data) => {
          setItems(data);
          setLoadingItems(false);
        })
        .catch((err) => {
          console.error("Erreur chargement items:", err);
          setLoadingItems(false);
        });
    }
  }, [selectedShopId, dbChoice]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Boutique{currentShopLabel ? ` : ${currentShopLabel}` : ""}
      </h1>


      {/* Bouton filtre mobile centré */}
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="bg-yellow-400 text-black px-4 py-2 rounded-full shadow-lg"
        >
          Filtrer
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtre latéral ou modal mobile */}
        <div className={`md:w-1/4 ${showMobileFilter ? "block" : "hidden md:block"}`}>
          <div className="flex flex-col gap-3 bg-[#1f1d3a] p-4 rounded-lg">
          {shops
            .filter((shop) => getTranslatedShopLabel(shop.label) !== null)
            .map((shop) => {
              const translatedLabel = getTranslatedShopLabel(shop.label);
              return (
                <button
                  key={shop.id}
                  onClick={() => {
                    setSelectedShopId(shop.currencyid);
                    setShowMobileFilter(false);
                  }}
                  className={`p-3 rounded-lg transition border text-left hover:bg-[#2a2750] ${
                    selectedShopId === shop.currencyid
                      ? "bg-[#2a2750] border-yellow-400 text-yellow-300"
                      : "bg-[#1f1d3a] border-transparent"
                  }`}
                >
                  {translatedLabel}
                </button>
              );
            })}

          </div>
        </div>

        {/* Liste des items */}
        <div className="flex-1">
          {loadingItems ? (
            <p className="text-center">Chargement des items...</p>
          ) : items.length === 0 ? (
            <p className="text-center">Aucun item trouvé pour cette boutique.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-[#1f1d3a] hover:bg-[#2a2750] rounded-2xl p-4 text-center shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {/* Nom de l’item en haut */}
                  <div className="text-gray-300 text-xs font-medium mb-2">{item.name}</div>

                  {/* Bloc image */}
                  <div className="relative flex justify-center items-center flex-col">
                    {item.icon && (
                      <IconCanvas
                        prefix="sactx-0-4096x4096-ASTC 6x6-icon_daojv-"
                        iconName={item.icon}
                        jsonDir="/images/atlas/icon_daojv/"
                        canvasId={`canvas-item-${item.id}-${index}`}
                        imgHeight={4096}
                        size={2}
                      />
                    )}

                    {/* Prix centré juste en dessous de l’image */}
                    {item.iconMoney && (
                      <div className="mt-2 text-[12px] text-gray-200 flex items-center justify-center gap-1">
                        <span>{item.moneyprice}</span>
                        <IconCanvas
                          prefix="sactx-0-4096x4096-ASTC 6x6-icon_daojv-"
                          iconName={item.iconMoney}
                          jsonDir="/images/atlas/icon_daojv/"
                          canvasId={`canvas-money-${item.id}-${index}`}
                          imgHeight={4096}
                          size={4}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>





          )}
        </div>


      </div>
    </div>
  );
}
