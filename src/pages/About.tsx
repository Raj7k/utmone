import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="py-section bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <AnimatedHeadline>
            <div className="text-center space-y-6">
              <div className="hero-glow">
                <h1 className="hero-gradient text-5xl md:text-6xl lg:text-8xl font-display font-extrabold tracking-tight text-balance">
                  about utm.one
                </h1>
              </div>
            </div>
          </AnimatedHeadline>
        </div>
      </section>

      {/* What is utm.one */}
      <section className="py-group bg-white">
        <div className="max-w-[800px] mx-auto px-8">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-heading-2 font-display font-bold">
                what is utm.one
              </h2>
              <div className="space-y-6 text-body-text text-muted-foreground leading-relaxed">
                <p>
                  utm.one is the simplest way to make your links smarter.
                </p>
                <p className="text-foreground font-medium">
                  not longer. not louder. just smarter.
                </p>
                <p>
                  it&apos;s built for a world where humans still click links, but machines decide what gets recommended, ranked, or ignored.
                  so we designed utm.one from scratch with one goal — make your link the strongest signal in an LLM-first world.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* The Idea Behind It */}
      <section className="py-group bg-muted/20">
        <div className="max-w-[800px] mx-auto px-8">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-heading-2 font-display font-bold">
                the idea behind it
              </h2>
              <div className="space-y-6 text-body-text text-muted-foreground leading-relaxed">
                <p>
                  marketing today is two battles happening at the same time:
                </p>
                <p>
                  one is the old internet: SEO, social feeds, ads, UTMs.
                </p>
                <p>
                  the new one is the LLM layer: people ask, AI answers.
                </p>
                <p>
                  if your brand, campaign, or message isn&apos;t structured in a way LLMs can understand instantly, you don&apos;t exist.
                </p>
                <p>
                  utm.one fixes that by compressing all the metadata — intent, topic, entity, category, and use-case — into one beautifully clean link.
                  no clutter. no tracking creep. no messy spreadsheets.
                </p>
                <p className="text-foreground font-medium">
                  just a single source of truth for your distribution.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What Makes utm.one Different */}
      <section className="py-group bg-white">
        <div className="max-w-[800px] mx-auto px-8">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-heading-2 font-display font-bold">
                what makes utm.one different
              </h2>
              <p className="text-body-text text-muted-foreground italic">
                minimal on the outside. structured to perfection inside.
              </p>
              <ul className="space-y-4 text-body-text text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>ultra-clean URLs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>human-readable naming</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>ai-readable metadata</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>consistent taxonomy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>built-in campaign governance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>&quot;memory-safe&quot; tagging for future LLM crawlers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>instant share-ready format for teams</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>one-click analytics setup</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>templates inspired by apple&apos;s simplicity & google&apos;s information architecture</span>
                </li>
              </ul>
              <p className="text-foreground font-medium pt-4">
                it&apos;s the closest version of &quot;UTMs that think.&quot;
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-group bg-muted/20">
        <div className="max-w-[800px] mx-auto px-8">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-heading-2 font-display font-bold">
                why it matters
              </h2>
              <div className="space-y-6 text-body-text text-muted-foreground leading-relaxed">
                <p>
                  every link you create is a ranking signal.<br />
                  every link you share is a context signal.<br />
                  every link your team uses is a consistency signal.
                </p>
                <p className="text-foreground font-medium">
                  utm.one ensures all three work in your favour — not against you.
                </p>
                <p className="pt-4">
                  this is not a link-shortener.<br />
                  <span className="text-foreground font-semibold">it&apos;s a context engine.</span>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="py-group bg-white">
        <div className="max-w-[800px] mx-auto px-8">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-heading-2 font-display font-bold">
                the philosophy
              </h2>
              <div className="space-y-6 text-body-text text-muted-foreground leading-relaxed">
                <p>
                  when we designed utm.one, we asked a simple question:
                </p>
                <p className="text-foreground font-medium text-xl">
                  &quot;if apple built a link system, how would it feel?&quot;
                </p>
                <div className="pl-8 space-y-3 pt-4">
                  <p>clean.</p>
                  <p>uncomplicated.</p>
                  <p>intentional.</p>
                  <p>emotionally quiet.</p>
                  <p>functionally brilliant.</p>
                </div>
                <p className="pt-4 text-foreground font-medium">
                  that&apos;s the design north star.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-group bg-muted/20">
        <div className="max-w-[800px] mx-auto px-8">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-heading-2 font-display font-bold">
                who is it for
              </h2>
              <div className="space-y-6 text-body-text text-muted-foreground leading-relaxed">
                <p>
                  creators, marketers, founders, product teams, community builders, growth leaders — anyone who wants:
                </p>
                <ul className="space-y-3 pl-8">
                  <li>consistent campaign naming</li>
                  <li>beautifully short links</li>
                  <li>metadata that LLMs understand</li>
                  <li>context that improves conversions</li>
                  <li>clarity that scales across teams</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* The Promise */}
      <section className="py-group bg-white">
        <div className="max-w-[800px] mx-auto px-8">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-heading-2 font-display font-bold">
                the promise
              </h2>
              <div className="space-y-6 text-body-text text-muted-foreground leading-relaxed">
                <p>
                  you&apos;ll spend less time fixing broken tracking,<br />
                  and more time crafting better stories.
                </p>
                <p>
                  because distribution shouldn&apos;t feel like a chore.<br />
                  <span className="text-foreground font-semibold">it should feel like a design choice.</span>
                </p>
                <p className="text-foreground font-bold text-xl pt-6">
                  utm.one is that choice.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
