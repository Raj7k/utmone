import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface RelatedArticle {
  title: string;
  href: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  if (articles.length === 0) return null;

  return (
    <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-200 mt-8">
      <h3 className="text-sm font-semibold text-zinc-900 mb-4">Related articles</h3>
      <div className="space-y-2">
        {articles.map((article) => (
          <Link
            key={article.href}
            to={article.href}
            className="flex items-center justify-between py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors group"
          >
            <span>{article.title}</span>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};
