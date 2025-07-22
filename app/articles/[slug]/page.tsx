//export const dynamic = "force-dynamic";

import LikeButton from '@/components/LikeButton';
import he from 'he';

const API_URL = process.env.PUBLIC_INTERNAL_API_URL || 'http://localhost:8055';
const PUBLIC_URL = process.env.NEXT_PUBLIC_PUBLIC_URL || 'http://localhost:8055';

type Article = {
  id: number;
  slug: string;
  user_created: { first_name: string };
  date_created: string;
  title: string;
  text: string;
  tags: string[];
  images?: string;
  likes?: number;
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function cleanHTML(html: string): string {
  const noHtml = html.replace(/ class="[^"]*"/g, '');
  return he.decode(noHtml);
}

async function getArticleBySlug(slug: string): Promise<Article | null> {
  const res = await fetch(`${API_URL}/items/Articles?filter[slug][_eq]=${slug}&fields=*,user_created.first_name,likes,status`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Erreur chargement article :", res.status);
    return null;
  }

  const json = await res.json();
  return json.data?.[0] || null;
}

async function getRandomArticles(currentId: number): Promise<Article[]> {
  try {
    const res = await fetch(`${API_URL}/items/Articles?filter[status][_eq]=published&limit=100&fields=id,title,date_created,images,slug`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Erreur chargement articles :", res.status);
      return [];
    }

    const json = await res.json();

    let articles: Article[] = Array.isArray(json.data) ? json.data : [];

    articles = articles.filter((a) => a.id !== currentId);

    for (let i = articles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [articles[i], articles[j]] = [articles[j], articles[i]];
    }

    return articles.slice(0, 5);
  } catch (err) {
    console.error("Erreur réseau ou parsing JSON :", err);
    return [];
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Date inconnue";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type PageProps = {
  params: { slug: string };
};

export default async function ArticlePage({ params }: PageProps) {
  const slug = params.slug;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="text-center text-white py-20">
        <h1 className="text-3xl font-bold">Article non trouvé</h1>
      </div>
    );
  }

  const randomArticles = await getRandomArticles(article.id);

  const backgroundImage = article.images
    ? `/api/sharpen-image?src=${encodeURIComponent(`${PUBLIC_URL}/assets/${article.images}`)}`
    : null;

  return (
    <div className="relative min-h-screen">
      {backgroundImage && (
        <div className="absolute top-0 left-0 right-0 h-[800px] z-0 overflow-hidden">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover object-[center_20%] opacity-90"
            style={{ imageRendering: 'auto' }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20 pt-[200px]">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 items-start bg-white/90 text-black rounded-xl shadow-lg p-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
              <span>
                Publié le {formatDate(article.date_created)} par {article.user_created?.first_name || "Inconnu"} ✨
              </span>
            </div>
            {article.text && (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: cleanHTML(article.text) }} />
              </div>
            )}
            <div className="mt-8">
              <LikeButton articleId={article.id.toString()} initialLikes={article.likes || 0} />
            </div>
          </div>

          {randomArticles.length > 0 && (
            <div className="hidden md:block">
              <h2 className="text-xl font-semibold mb-6">Articles recommandés</h2>
              <div className="flex flex-col gap-6">
                {randomArticles.map((art) => (
                  <a
                    key={art.id}
                    href={`/articles/${art.slug || slugify(art.title)}`}
                    className="bg-black/80 rounded-lg shadow-inner overflow-hidden hover:shadow-md transition duration-300 flex flex-col h-full"
                  >
                    {art.images && (
                      <img
                        src={`${PUBLIC_URL}/assets/${art.images}`}
                        alt={art.title}
                        className="w-full h-60 object-cover object-[center_20%]"
                      />
                    )}
                    <div className="flex flex-col justify-between flex-1 p-4">
                      <h3 className="text-xm font-bold text-white">{art.title}</h3>
                      <p className="text-xs text-blue-100 mt-2">{formatDate(art.date_created)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {randomArticles.length > 0 && (
        <div className="block md:hidden mt-12 px-4">
          <h2 className="text-xl font-semibold mb-6 text-white">Articles recommandés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {randomArticles.map((art) => (
              <a
                key={art.id}
                href={`/articles/${art.slug || slugify(art.title)}`}
                className="bg-black/80 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col h-full"
              >
                {art.images && (
                  <img
                    src={`${PUBLIC_URL}/assets/${art.images}`}
                    alt={art.title}
                    className="w-full h-48 object-cover object-[center_20%]"
                  />
                )}
                <div className="flex flex-col justify-between flex-1 p-4">
                  <h3 className="text-xm font-bold text-white">{art.title}</h3>
                  <p className="text-xs text-blue-100 mt-2">{formatDate(art.date_created)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
