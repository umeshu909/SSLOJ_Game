"use client";
import { useEffect, useState } from "react";
import DiffMatchPatch from "diff-match-patch";

interface Props {
  text?: string;         // Mode texte direct
  skillId?: number;      // Mode dynamique (ID de skill)
  level?: number;
  dbChoice?: string;     // FR, EN, CN, etc.
}

const Description = ({ text, skillId, level, dbChoice = "FR" }: Props) => {
  const [parsed, setParsed] = useState<string>("Chargement...");
  const [diffText, setDiffText] = useState<string | null>(null);
  const [showOld, setShowOld] = useState<boolean>(false);

  useEffect(() => {
    const lang = dbChoice || localStorage.getItem("lang") || "FR";

    const resolveParsedText = async (langChoice: string): Promise<string> => {
      let baseText = text;

      // Si pas de texte fourni mais skillId + level présents
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

      // On parse les placeholders via l’API
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
      str
        .replace(/&/g, "&amp;")
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

    const compareAndFormat = (current: string, old: string) => {
      const dmp = new DiffMatchPatch();
      const diffs = dmp.diff_main(old, current);
      dmp.diff_cleanupSemantic(diffs);

      const hasDiff = diffs.some(([op]) => op !== 0);

      return {
        formatted: formatText(current),
        oldFormatted: hasDiff ? formatText(old) : null,
        hasDiff,
      };
    };

    const fetchAndCompare = async () => {
      try {
        const current = await resolveParsedText(lang);

        // Si pas FR, on ne compare pas : juste formattage
        if (lang !== "FR") {
          setParsed(formatText(current));
          setDiffText(null);
          return;
        }

        const old = await resolveParsedText("OLDFR");

        if (!current) {
          setParsed("Aucune description disponible");
          setDiffText(null);
          return;
        }

        const { formatted, oldFormatted, hasDiff } = compareAndFormat(current, old);
        setParsed(formatted);
        setDiffText(hasDiff ? oldFormatted : null);
      } catch (err) {
        console.error("Erreur parsing:", err);
        setParsed("Erreur lors du chargement de la description");
        setDiffText(null);
      }
    };

    fetchAndCompare();
  }, [text, skillId, level, dbChoice]);

  return (
    <div className="inline">
      <span dangerouslySetInnerHTML={{ __html: parsed }} />

      {diffText && (
        <div className="mt-2">
          <button
            onClick={() => setShowOld(!showOld)}
            className="text-sm text-blue-400 underline hover:text-blue-300"
          >
            {showOld ? "Masquer l’ancienne version" : "Voir l’ancienne version"}
          </button>

          {showOld && (
            <div className="mt-2 p-2 border border-white/20 rounded bg-white/5 text-sm text-white space-y-1">
              <div dangerouslySetInnerHTML={{ __html: diffText }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Description;
