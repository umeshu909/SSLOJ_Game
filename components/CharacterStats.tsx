import React from "react";

interface Props {
  stats: Record<string, string | number>;
}

export default function CharacterStats({ stats }: Props) {
  if (!stats) return null;

  return (
    <section className="mt-6 text-white text-sm">
      <h2 className="text-2xl font-semibold mb-4">Statistiques</h2>

      <div className="space-y-1">
        {Object.entries(stats).map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="font-medium">{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}