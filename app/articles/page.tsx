// app/articles/page.tsx
export const dynamic = "force-dynamic";
import he from 'he';

const API_URL = process.env.PUBLIC_INTERNAL_API_URL || 'http://localhost:8055';
const PUBLIC_URL = process.env.NEXT_PUBLIC_PUBLIC_URL || 'http://localhost:8055';

type Article = {
  id: number;
  slug: string;
  title: string;
  text: string;
  date_created: string;
  user_created: string;
  images?: string;
};

function cleanText(html: string): string {
  const noHtml = html.replace(/<[^>]*>/g, '');
  return he.decode(noHtml);
}

async function getArticles(): Promise<Article[]> {
  const res = await fetch(`${API_URL}/items/Articles?fields=id,title,text,date_created,user_created.first_name,images,status,slug&filter[status][_eq]=published`, {
    cache: "no-store",
  });

  const json = await res.json();
  const articles = json.data || [];

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
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-4xl font-bold text-white mb-8">Articles</h1>

      <div className="grid gap-6 md:grid-cols-3 items-start">
        {articles.map((article) => {
          const imageUrl = article.images ? `${PUBLIC_URL}/assets/${article.images}` : null;

          return (
            <a
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="bg-[#1f1d3a] hover:bg-[#29264a] rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 overflow-hidden flex flex-col h-full"
            >
              {/* Image */}
              {imageUrl && (
                <div className="w-full h-[300px] overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover object-[center_20%] transform transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}

              {/* Contenu */}
              <div className="flex flex-col flex-1 p-5 text-white">
                <h2 className="text-base font-semibold text-yellow-400 mb-1">{article.title}</h2>

                <div className="text-left text-xs text-gray-500">
                  Le {formatDate(article.date_created)} par {article.user_created?.first_name || "Inconnu"} ✨
                </div>

                <p className="text-xs text-white/80 leading-relaxed flex-1 mt-5">
                  {getExcerpt(cleanText(article.text), 50)}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
