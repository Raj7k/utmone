import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

const Docs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-6">
            <div className="hero-glow">
              <h1 className="hero-gradient text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-balance">
                documentation
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-secondary-label max-w-[720px] mx-auto leading-relaxed">
              everything you need to know about utm.one.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Docs;
