"use client";

import { useEffect, useState } from "react";

const highlightSQL = (query: string) => {
  return query.replace(/\b(UPDATE|INSERT INTO|DELETE FROM|SET|WHERE|VALUES|INTO)\b/gi, match => {
    return `<span class='text-yellow-300 font-bold'>${match}</span>`;
  });
};

export default function CompareDatabasesPage() {
  const [data, setData] = useState<Record<string, string[]> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/compare-databases")
      .then(res => res.json())
      .then(raw => {
        const sorted = Object.fromEntries(
          Object.entries(raw).sort(([a], [b]) => a.localeCompare(b))
        );

        setData(sorted);
      })
      .catch(err => {
        console.error("Erreur chargement comparaison :", err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Comparaison des bases</h1>

      {loading ? (
        <p className="text-center">Chargement de la comparaison...</p>
      ) : !data || Object.keys(data).length === 0 ? (
        <p className="text-center">Aucune différence détectée.</p>
      ) : (
        <div className="space-y-10">
          {Object.entries(data).map(([table, queries], index) => (
            <div key={index} className="bg-[#1f1d3a] p-4 rounded-lg shadow">
              <h2 className="text-yellow-400 font-semibold text-lg mb-4">Table : {table}</h2>
              <div className="space-y-2 text-sm break-words">
                {queries.map((query, i) => (
                  <div
                    key={i}
                    className="bg-[#2a2750] p-2 rounded"
                    dangerouslySetInnerHTML={{ __html: highlightSQL(query) }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
