import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { APIPlayground as PlaygroundComponent } from "@/components/developer/APIPlayground";

export default function APIPlayground() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="space-y-6 mb-8">
          <h1 className="text-4xl font-display font-bold hero-gradient">
            API Playground
          </h1>
          <p className="text-lg text-secondary-label max-w-2xl">
            Test utm.one API endpoints interactively. Try queries, mutations, and see real-time responses.
          </p>
        </div>

        <PlaygroundComponent />
      </div>

      <Footer />
    </div>
  );
}
