"use client";
import { useEffect, useState } from "react";
import DiffMatchPatch from "diff-match-patch";

interface Props {
  text?: string;         // mode texte direct
  skillId?: number;      // mode dynamique
  level?: number;
  dbChoice?: string;     // FR, EN, CN, etc.
}

const Description = ({ text, skillId, level, dbChoice = "FR" }: Props) => {
  const [parsed, setParsed] = useState<string>("Chargement...");

  useEffect(() => {
    const lang = dbChoice || localStorage.getItem("lang") || "FR";

    // Si pas de texte direct mais skillId + level, on va chercher le texte
    const resolveParsedText = async (langChoice: string): Promise<string> => {
      let baseText = text;

      if (!baseText && skillId && level !== undefined) {
        const res = await fetch("/api/skills/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skillid: skillId, level, lang: langChoice }),
        });
        const json = await res.json();
        baseText = json.result || "";
      }

      if (!baseText) return "";

      // 🟡 Ici on parse le texte (avec #123-456#) via /skills/parse
      const resParsed = await fetch("/api/skills/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-db-choice": langChoice,
        },
        body: JSON.stringify({ text: baseText, dbChoice: langChoice }),
      });

      const jsonParsed = await resParsed.json();
      return jsonParsed.result || "";
    };


    const formatText = (raw: string): string => {
      return raw
        .replace(/\\n/g, "<br/>")
        .replace(/(^|<br\/?>)(\s*[A-Za-zÀ-ÿ\-]{4,15})\s*:/g, '$1<span class="text-purple-200">$2:</span>')
        .replace(/(\d+([.,]\d+)?[\s\u00A0]*%)/g, '<span style="color: lightgreen;">$1</span>')
        .replace(/(\d+(?:[.,]\d+)?)(?=\s*(secondes?|seconde|sec|couches?|points?|fois?)\b|s\b)/gi, '<span style="color: #82B0D6;">$1</span>')
        .replace(/(\d+)\.00\b/g, "$1")
        .replace(/\[(.*?)\]/g, '<span style="color: orange;">[$1]</span>');
    };

    const escapeHtml = (str: string): string =>
      str.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;");

    const cleanPlainText = (str: string): string => {
      return str
        .replace(/\\n/g, " ")
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };

    const compareAndFormat = (current: string, old: string): string => {
      const dmp = new DiffMatchPatch();
      const diffs = dmp.diff_main(old, current);
      dmp.diff_cleanupSemantic(diffs);

      const hasDeletion = diffs.some(([op]) => op === -1);

      if (hasDeletion) {
        const formatted = formatText(current);
        const title = escapeHtml(cleanPlainText(old));
        return `<span style="color:red;" title="${title}">${formatted}</span>`;
      }

      // Sinon, comportement normal
      return diffs
        .map(([op, data]) => {
          if (op === 1) {
            const formatted = formatText(data);
            const title = escapeHtml(cleanPlainText(old));
            return `<span style="color:red;" title="${title}">${formatted}</span>`;
          } else if (op === 0) {
            return formatText(data);
          } else {
            return ""; // on ignore les suppressions
          }
        })
        .join("");
    };


    const fetchAndCompare = async () => {
      try {
        if (lang !== "FR") {
          // 🔹 Si pas FR : juste formattage sans comparaison
          const raw = await resolveParsedText(lang);
          const formatted = formatText(raw);
          setParsed(formatted);
          return;
        }

        const rawCurrent = await resolveParsedText(lang);
        const rawOld = await resolveParsedText("OLDFR");

        if (!rawCurrent) {
          setParsed("Aucune description disponible");
          return;
        }

        const final = compareAndFormat(rawCurrent, rawOld);
        setParsed(final);
      } catch (err) {
        console.error("Erreur parsing:", err);
        setParsed("Erreur lors du chargement de la description");
      }
    };

    fetchAndCompare();
  }, [text, skillId, level, dbChoice]);

  return <p className="inline" dangerouslySetInnerHTML={{ __html: parsed }} />;
};

export default Description;
