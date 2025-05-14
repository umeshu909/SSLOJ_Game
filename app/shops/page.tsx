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
      <h1 className="text-2xl font-bold mb-6 text-center">Boutique</h1>

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
            {shops.map((shop) => (
              <button
                key={shop.id}
                onClick={() => {
                  setSelectedShopId(shop.currencyid);
                  setShowMobileFilter(false);
                }}
                className={`p-3 rounded-lg transition border text-left hover:bg-[#2a2750] ${
                  selectedShopId === shop.currencyid ? "bg-[#2a2750] border-yellow-400 text-yellow-300" : "bg-[#1f1d3a] border-transparent"
                }`}
              >
                {shop.label}
              </button>
            ))}
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
                <div key={index} className="relative bg-[#1f1d3a] rounded-xl p-4 text-center shadow-md">
                  {/* Icône de l’item */}
                  <div className="relative flex items-start">
                    {/* Image item avec cadre doré à gauche */}
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

                    {/* Overlay prix + icône monnaie aligné à droite */}
                    {item.iconMoney && (
                      <div className="absolute top-0 right-0 flex items-center gap-1 px-2 py-1 rounded-bl-lg text-xs text-white">
                        <span>{item.moneyprice}</span>
                        <IconCanvas
                          prefix="sactx-0-4096x4096-ASTC 6x6-icon_daojv-"
                          iconName={item.iconMoney}
                          jsonDir="/images/atlas/icon_daojv/"
                          canvasId={`canvas-money-${item.id}-${index}`}
                          imgHeight={4096}
                          size={3}
                        />
                      </div>
                    )}
                  </div>


                  {/* Nom de l’item */}
                  <div className="mt-3 text-yellow-300 font-semibold text-sm">{item.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
