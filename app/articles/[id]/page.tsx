// app/articles/[id]/page.tsx
export const dynamic = "force-dynamic";
import LikeButton from '@/components/LikeButton'; // adapte le chemin si besoin
import he from 'he';

const API_URL = process.env.PUBLIC_INTERNAL_API_URL || 'http://localhost:8055';
const PUBLIC_URL = process.env.NEXT_PUBLIC_PUBLIC_URL || 'http://localhost:8055';


type Article = {
  id: number;
  user_created: string;
  date_created: string;
  title: string;
  text: string;
  tags: string[];
  images?: string; // ton champ images est juste un ID d'asset
};

function cleanHTML(html: string): string {
  const noHtml = html.replace(/ class="[^"]*"/g, '');
  return he.decode(noHtml);
}

async function getArticle(id: string): Promise<Article | null> {
  const res = await fetch(`${API_URL}/items/Articles/${id}?fields=*,user_created.first_name,likes,status&filter[status][_eq]=published`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Erreur chargement article :", res.status);
    return null;
  }

  const json = await res.json();
  return json.data || null;
}

async function getRandomArticles(currentId: string): Promise<Article[]> {
  const res = await fetch(`${API_URL}/items/Articles?filter[status][_eq]=published&limit=100&fields=id,title,date_created,images`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Erreur chargement articles :", res.status);
    return [];
  }

  const json = await res.json();
  let articles: Article[] = json.data || [];

  // Exclure l'article courant
  articles = articles.filter((a) => a.id.toString() !== currentId);

  // Mélange aléatoire (algorithme de Fisher-Yates)
  for (let i = articles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [articles[i], articles[j]] = [articles[j], articles[i]];
  }

  // Retourner les 3 premiers du shuffle
  return articles.slice(0, 5);
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
  params: { id: string };
};

export default function ArticlePageWrapper({ params }: PageProps) {
  return <ArticlePageAsync id={params.id} />;
}


async function ArticlePageAsync({ id }: { id: string }) {
  const article = await getArticle(id);
  const randomArticles = await getRandomArticles(id);

  if (!article) {
    return (
      <div className="text-center text-white py-20">
        <h1 className="text-3xl font-bold">Article non trouvé</h1>
      </div>
    );
  }

  const backgroundImage = article.images
    ? `/api/sharpen-image?src=${encodeURIComponent(`${PUBLIC_URL}/assets/${article.images}`)}`
    : null;

  return (
    <div className="relative min-h-screen">
      {/* Fond */}
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
          {/* ✅ Colonne gauche : article */}
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
              <LikeButton articleId={id} initialLikes={article.likes || 0} />
            </div>
          </div>

          {/* ✅ Colonne droite (desktop uniquement) */}
          {randomArticles.length > 0 && (
            <div className="hidden md:block">
              <h2 className="text-xl font-semibold mb-6">Articles recommandés</h2>
              <div className="flex flex-col gap-6">
                {randomArticles.map((art) => (
                  <a
                    key={art.id}
                    href={`/articles/${art.id}`}
                    className="bg-black/80 rounded-lg shadow-inner overflow-hidden hover:shadow-md transition duration-300 flex flex-col h-full"
                  >
                    {art.images && (
                      <img
                        src={`${PUBLIC_URL}/assets/${art.images}`}
                        alt={art.title}
                        className="w-full h-36 object-cover object-[center_20%]"
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

      {/* ✅ Version mobile : articles recommandés en bas */}
      {randomArticles.length > 0 && (
        <div className="block md:hidden mt-12 px-4">
          <h2 className="text-xl font-semibold mb-6 text-white">Articles recommandés</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {randomArticles.map((art) => (
              <a
                key={art.id}
                href={`/articles/${art.id}`}
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



