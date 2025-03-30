export async function parseText(text: string): Promise<string> {
    try {
      const lang = localStorage.getItem("lang") || "FR";
  
      const response = await fetch("/api/skills/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, dbChoice: lang }),
      });
  
      if (!response.ok) {
        console.error("Erreur dans le parsing :", response.statusText);
        return text;
      }
  
      const data = await response.json();
      return data.result || text;
    } catch (error) {
      console.error("Erreur dans parseText:", error);
      return text;
    }
  }