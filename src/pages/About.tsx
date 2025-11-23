import { Navigation } from "@/components/landing/Navigation";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center space-y-6">
            <div className="hero-glow">
              <h1 className="hero-gradient text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-balance">
                about utm.one
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-[720px] mx-auto leading-relaxed">
              we believe clarity creates confidence.
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

export default About;
