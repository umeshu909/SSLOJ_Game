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

      <div className="grid gap-6">
        {articles.map((article) => {
          const imageUrl = article.images ? `${PUBLIC_URL}/assets/${article.images}` : null;

          return (
            <a
              key={article.id}
              href={`/articles/${article.id}`}
              className="flex flex-col md:flex-row items-stretch bg-neutral-800/70 hover:bg-neutral-700 transition-all border border-neutral-700 rounded-2xl shadow-md hover:shadow-lg overflow-hidden"
            >
              {/* Image à gauche */}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={article.title}
                  className="w-full md:w-48 h-48 object-cover object-top md:rounded-l-2xl md:rounded-r-none rounded-t-2xl md:rounded-t-none"
                />
              )}

              {/* Contenu à droite */}
              <div className="flex flex-col justify-between p-5 text-white flex-1">
                <div>
                  <h2 className="text-2xl font-semibold text-blue-100 mb-2">{article.title}</h2>
                  <p className="text-gray-100 text-sm leading-relaxed">
                    {decodeHtmlEntities(getExcerpt(cleanText(article.text), 50))}
                  </p>
                </div>

                <div className="flex justify-end mt-4">
                  <span className="text-xs text-blue-300">{formatDate(article.date_created)}</span>
                </div>
              </div>
            </a>


          );
        })}
      </div>
    </div>
  );
}
