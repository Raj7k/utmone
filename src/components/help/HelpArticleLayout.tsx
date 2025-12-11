import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface HelpArticleLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  backLink?: string;
  backLabel?: string;
  breadcrumbs?: Breadcrumb[];
}

export function HelpArticleLayout({
  title,
  description,
  children,
  backLink = "/help",
  backLabel = "Back to Help Center",
  breadcrumbs,
}: HelpArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3 w-3" />}
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <Button variant="ghost" asChild className="mb-6">
            <Link to={backLink} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
        )}

        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </header>

        <article className="prose prose-zinc dark:prose-invert max-w-none">
          {children}
        </article>
      </div>
    </div>
  );
}
