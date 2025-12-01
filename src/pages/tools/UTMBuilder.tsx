import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UTMBuilderBasic } from "@/components/utm-builder/UTMBuilderBasic";

export default function UTMBuilder() {
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
            free utm builder
          </h1>
          <p className="text-lg text-secondary-label max-w-2xl mx-auto">
            build consistent utm-tagged urls instantly. no signup required.
          </p>
        </div>

        <UTMBuilderBasic />

        {/* Pro Features Callout */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-muted/20 border border-border/40 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              want to save these presets?
            </h3>
            <p className="text-sm text-secondary-label mb-6">
              Pro users get smart autocomplete with historical CTR predictions, saved templates, and team-wide UTM taxonomy enforcement.
            </p>
            <Link to="/pricing">
              <Button variant="default">
                see pro features →
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
