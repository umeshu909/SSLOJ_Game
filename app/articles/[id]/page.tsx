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

      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-20 pt-[200px]">
        <div className="bg-white/90 text-black rounded-xl shadow-lg p-8">
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
      </div>
    </div>
  );
}


