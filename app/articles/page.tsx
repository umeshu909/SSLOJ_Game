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
    .replace(/&amp;/g, "&");
}

function cleanText(html: string): string {
  const noHtml = html.replace(/<[^>]*>/g, '');
  return decodeHtmlEntities(noHtml);
}

async function getArticles(): Promise<Article[]> {
  const res = await fetch("${API_URL}/items/Articles?fields=id,title,text,date_created,images", {
    cache: "no-store",
  });

  const json = await res.json();
  return json.data || [];
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">Articles</h1>

      <div className="space-y-6">
        {articles.map((article) => {
          const imageUrl = article.images ? `${PUBLIC_URL}/assets/${article.images}` : null;

          return (
              <a
                key={article.id}
                href={`/articles/${article.id}`}
                className="block border border-blue-700 rounded-xl p-4 bg-blue-800/60 shadow hover:bg-blue-700 transition-colors text-white space-y-4"
              >
                {/* Titre + Date (au-dessus) */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-blue-200">{article.title}</h2>
                  <span className="text-sm text-blue-300">{formatDate(article.date_created)}</span>
                </div>

                {/* Texte + Image (en flex uniquement ici) */}
                <div className="flex flex-col md:flex-row items-start gap-4">
                  {/* Texte */}
                  {article.text && (
                    <p className="text-gray-100">
                      {getExcerpt(cleanText(article.text), 50)}
                    </p>
                  )}



                  {/* Image */}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={article.title}
                      className="w-24 max-h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                </div>
              </a>


          );
        })}
      </div>
    </div>
  );
}
