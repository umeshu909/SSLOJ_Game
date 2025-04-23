import { getAbsoluteMediaUrl } from "@/lib/getAbsoluteMediaUrl";
import { serializeRichText } from "@/lib/serializeRichText";

export const dynamic = "force-dynamic";

type Article = {
  id: string;
  title: string;
  slug: string;
  publishedDate?: string;
  content: any;
  thumbnail?: {
    url?: string;
  };
};

async function getArticle(slug: string): Promise<Article | null> {
  const CMS_URL = process.env.CMS_URL || "http://localhost:3000";

  const res = await fetch(
    `${CMS_URL}/api/articles?where[slug][equals]=${slug}&depth=2`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.docs?.[0] || null;
}

export default async function ArticleDetail({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) {
    return (
      <div className="text-center text-white mt-20">Article introuvable.</div>
    );
  }

  const html = await serializeRichText(article.content);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-white">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      {article.publishedDate && (
        <p className="text-sm text-gray-400 mb-4">
          Publié le {new Date(article.publishedDate).toLocaleDateString("fr-FR")}
        </p>
      )}

      {article.thumbnail?.url && (
        <img
          src={getAbsoluteMediaUrl(article.thumbnail.url)}
          alt={article.title}
          className="rounded-lg mb-6"
        />
      )}

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}