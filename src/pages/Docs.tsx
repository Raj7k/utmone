import { Navigation } from "@/components/landing/Navigation";

const Docs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl text-foreground font-extrabold tracking-tight">
              documentation
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-[720px] mx-auto leading-relaxed">
              everything you need to know about utm.one.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center">
            <span className="text-[13px] text-muted-foreground">
              © 2024 utm.one. clarity creates confidence.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Docs;
