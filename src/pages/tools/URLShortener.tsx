import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { URLShortenerBasic } from "@/components/url-shortener/URLShortenerBasic";

export default function URLShortener() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-foreground">
            utm.one
          </Link>
          <Link to="/early-access">
            <Button variant="default" size="sm">
              get early access
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            free url shortener
          </h1>
          <p className="text-lg text-secondary-label max-w-2xl mx-auto">
            create short links instantly on <span className="font-mono font-medium text-foreground">utm.click</span>. no signup required.
          </p>
        </div>

        <URLShortenerBasic />
      </main>
    </div>
  );
}
