import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const searchableContent = [
  { title: "Creating your first link", href: "/help/getting-started#first-link", keywords: ["create", "new", "link", "start"] },
  { title: "UTM parameters explained", href: "/help/utm", keywords: ["utm", "source", "medium", "campaign", "tracking"] },
  { title: "QR code customization", href: "/help/qr#customization", keywords: ["qr", "code", "customize", "brand", "logo"] },
  { title: "Attribution models", href: "/help/attribution#models", keywords: ["attribution", "first-touch", "last-touch", "multi-touch"] },
  { title: "Event Halo tracking", href: "/help/events#event-halo", keywords: ["event", "halo", "field", "marketing", "trade show"] },
  { title: "Custom domain setup", href: "/help/domains", keywords: ["domain", "dns", "cname", "custom", "branded"] },
  { title: "Team permissions", href: "/help/team#permissions", keywords: ["team", "permissions", "roles", "admin", "editor"] },
  { title: "API documentation", href: "/help/integrations#api", keywords: ["api", "developer", "integration", "webhook"] },
  { title: "Billing & plans", href: "/help/billing", keywords: ["billing", "plan", "pricing", "upgrade", "subscription"] },
  { title: "Security settings", href: "/help/security", keywords: ["security", "mfa", "2fa", "password", "protection"] },
  { title: "Geo-targeting", href: "/help/advanced#geo-targeting", keywords: ["geo", "targeting", "country", "region", "location"] },
  { title: "A/B testing links", href: "/help/advanced#ab-testing", keywords: ["ab", "test", "experiment", "variant", "split"] },
  { title: "Bulk link creation", href: "/help/links#bulk", keywords: ["bulk", "import", "csv", "multiple", "batch"] },
  { title: "Tracking pixel setup", href: "/help/integrations#pixel", keywords: ["pixel", "tracking", "install", "javascript", "snippet"] },
  { title: "Revenue attribution", href: "/help/attribution#revenue", keywords: ["revenue", "attribution", "conversion", "roi", "value"] },
];

export const HelpSearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof searchableContent>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 1) {
      const filtered = searchableContent.filter(
        (item) =>
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          item.keywords.some((k) => k.includes(value.toLowerCase()))
      );
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelect = (href: string) => {
    navigate(href);
    setQuery("");
    setShowResults(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
        <Input
          type="search"
          placeholder="Search help articles..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length > 1 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-12 pr-4 py-6 text-base bg-zinc-50 border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
        />
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-zinc-200 shadow-lg overflow-hidden z-50">
          {results.map((result) => (
            <button
              key={result.href}
              onClick={() => handleSelect(result.href)}
              className="w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0"
            >
              <span className="text-sm font-medium text-zinc-900">{result.title}</span>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length > 1 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-zinc-200 shadow-lg p-4 z-50">
          <p className="text-sm text-zinc-500">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
};
