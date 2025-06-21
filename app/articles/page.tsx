// app/articles/page.tsx
export const dynamic = "force-dynamic";

const API_URL = process.env.PUBLIC_INTERNAL_API_URL || 'http://localhost:8055';
const PUBLIC_URL = process.env.NEXT_PUBLIC_PUBLIC_URL || 'http://localhost:8055';

type Article = {
  id: number;
  title: string;
  text: string;
  date_created: string;
  images?: string;
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/&ecirc;/g, "ê")
    .replace(/&agrave;/g, "à")
    .replace(/&acirc;/g, "â")
    .replace(/&ocirc;/g, "ô")
    .replace(/&ucirc;/g, "û")
    .replace(/&ccedil;/g, "ç")
    .replace(/&aacute;/g, "á")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}


function cleanText(html: string): string {
  const noHtml = html.replace(/<[^>]*>/g, '');
  return decodeHtmlEntities(noHtml);
}

async function getArticles(): Promise<Article[]> {
  const res = await fetch(`${API_URL}/items/Articles?fields=id,title,text,date_created,images`, {
    cache: "no-store",
  });

  const json = await res.json();
  const articles = json.data || [];

  // Tri décroissant par date (plus récent en premier)
  return articles.sort((a: Article, b: Article) =>
    new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
  );
}


function getExcerpt(text: string, wordLimit = 50): string {
  const words = text.split(/\s+/);
  return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Date inconnue";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-4xl font-bold text-white mb-8">Articles</h1>

      <div className="grid gap-6 md:grid-cols-3 items-start">
        {articles.map((article) => {
          const imageUrl = article.images ? `${PUBLIC_URL}/assets/${article.images}` : null;

          return (
            <a
              key={article.id}
              href={`/articles/${article.id}`}
              className="bg-[#1f1d3a] hover:bg-[#29264a] transition-colors rounded-2xl shadow-lg overflow-hidden flex flex-col h-full"
            >
              {/* Image */}
              {imageUrl && (
                <div className="w-full h-[250px] overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              )}

              {/* Contenu */}
              <div className="flex flex-col flex-1 p-5 text-white">
                <h2 className="text-xm font-semibold text-yellow-400 mb-2">{article.title}</h2>

                <p className="text-xs text-white/80 leading-relaxed flex-1">
                  {decodeHtmlEntities(getExcerpt(cleanText(article.text), 50))}
                </p>

                <div className="mt-4 text-right text-xs text-blue-300">
                  {formatDate(article.date_created)}
                </div>
              </div>
            </a>
          );
        })}
      </div>


  </div>
  );
}
