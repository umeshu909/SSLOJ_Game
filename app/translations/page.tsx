"use client";
import { useState, useEffect } from "react";

async function fetchTranslations(locale: string) {
  const res = await fetch(`/api/translations?locale=${locale}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function flattenObject(obj: any, prefix = ""): Record<string, string> {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix ? `${prefix}.` : "";
    const v = obj[k];
    if (typeof v === "object" && v !== null) {
      Object.assign(acc, flattenObject(v, pre + k));
    } else {
      acc[pre + k] = String(v);
    }
    return acc;
  }, {} as Record<string, string>);
}

export default function TranslationEditor() {
  const [translations, setTranslations] = useState<Record<string, { fr?: string; en?: string }>>({});
  const [newKey, setNewKey] = useState("");
  const [newFr, setNewFr] = useState("");
  const [newEn, setNewEn] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const frObj = await fetchTranslations("fr");
        const enObj = await fetchTranslations("en");
        const flatFr = flattenObject(frObj);
        const flatEn = flattenObject(enObj);
        const merged: typeof translations = {};
        new Set([...Object.keys(flatFr), ...Object.keys(flatEn)]).forEach(key => {
          merged[key] = { fr: flatFr[key], en: flatEn[key] };
        });
        setTranslations(merged);
      } catch (err) {
        console.error(err);
        setSaveMessage("Erreur lors du chargement");
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!newKey) { setSaveMessage("La clé est requise"); return; }
    const res = await fetch("/api/translations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: newKey, fr: newFr, en: newEn }),
    });
    const data = await res.json();
    setSaveMessage(data.message || "Enregistré.");
    setTimeout(() => location.reload(), 500);
  };

  const onSelect = (key: string, fr?: string, en?: string) => {
    setNewKey(key);
    setNewFr(fr ?? "");
    setNewEn(en ?? "");
  };

  return (
    <div className="p-6 space-y-6 text-gray-900">
      <h1 className="text-xl font-bold text-white">Éditeur de Traductions</h1>

      <div className="grid grid-cols-3 gap-4">
        <input placeholder="Clé" className="border bg-white text-black p-2 rounded"
          value={newKey} onChange={e => setNewKey(e.target.value)} />
        <input placeholder="FR" className="border bg-white text-black p-2 rounded"
          value={newFr} onChange={e => setNewFr(e.target.value)} />
        <input placeholder="EN" className="border bg-white text-black p-2 rounded"
          value={newEn} onChange={e => setNewEn(e.target.value)} />
      </div>

      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSave}>Ajouter / Modifier</button>
      {saveMessage && <p className="text-green-300">{saveMessage}</p>}

      <hr className="border-gray-500" />

      <div className="grid gap-1">
        {Object.entries(translations).map(([key, { fr, en }]) => (
          <div key={key}
            onClick={() => onSelect(key, fr, en)}
            className="grid grid-cols-3 gap-2 items-center p-2 rounded cursor-pointer
                       hover:bg-gray-200"
          >
            <span className="text-blue-600 font-mono text-sm">{key}</span>
            <span className="text-red-600 text-sm">{fr ?? <span className="italic text-gray-500">—</span>}</span>
            <span className="text-green-600 text-sm">{en ?? <span className="italic text-gray-500">—</span>}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
