import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { ProgressiveReveal } from "@/components/landing/ProgressiveReveal";
import { SEO } from "@/components/seo/SEO";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductMockup } from "@/components/product/ProductMockup";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const About = () => {
  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="About utm.one"
        description="utm.one is the simplest way to make your links smarter. Built for an LLM-first world where machines decide what gets recommended, ranked, or ignored."
        canonical="https://utm.one/about"
        ogType="article"
        keywords={["utm.one", "about", "link management", "llm-first", "campaign tracking"]}
      />
      <LLMSchemaGenerator 
        type="article" 
        data={{
          title: "About utm.one",
          description: "utm.one is the simplest way to make your links smarter. Built for an LLM-first world.",
          publishedDate: "2025-01-23",
          modifiedDate: "2025-01-23",
          url: "https://utm.one/about"
        }}
      />

      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[980px] mx-auto px-8">
          <AnimatedHeadline>
            <div className="text-center space-y-6">
              <div className="hero-glow">
                <h1 className="hero-gradient text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-balance">
                  about utm.one
                </h1>
              </div>
            </div>
          </AnimatedHeadline>
        </div>
      </section>

      {/* What is utm.one - With Visual */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              {/* Left: Content */}
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-label lowercase">
                  what is utm.one
                </h2>
                <div className="space-y-6 text-lg text-secondary-label leading-[1.75]">
                  <ProgressiveReveal>
                    <p>
                      utm.one is the simplest way to make your links smarter.
                    </p>
                  </ProgressiveReveal>
                  <p className="text-xl text-label font-medium">
                    not longer. not louder. just smarter.
                  </p>
                  <ProgressiveReveal>
                    <p>
                      it's built for a world where humans still click links, but machines decide what gets recommended, ranked, or ignored.
                      so we designed utm.one from scratch with one goal — make your link the strongest signal in an LLM-first world.
                    </p>
                  </ProgressiveReveal>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="flex-1 flex justify-center">
                <ProductMockup type="browser" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* The Idea Behind It - With Diagram */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16">
              {/* Left: Content */}
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-label lowercase">
                  the idea behind it
                </h2>
                <div className="space-y-6 text-lg text-secondary-label leading-[1.75]">
                  <ProgressiveReveal>
                    <p>
                      marketing today is two battles happening at the same time:
                    </p>
                  </ProgressiveReveal>
                  <ProgressiveReveal>
                    <p>
                      one is the old internet: SEO, social feeds, ads, UTMs.
                    </p>
                  </ProgressiveReveal>
                  <ProgressiveReveal>
                    <p>
                      the new one is the LLM layer: people ask, AI answers.
                    </p>
                  </ProgressiveReveal>
                  <ProgressiveReveal>
                    <p>
                      if your brand, campaign, or message isn't structured in a way LLMs can understand instantly, you don't exist.
                    </p>
                  </ProgressiveReveal>
                  <p className="text-xl text-label font-medium">
                    just a single source of truth for your distribution.
                  </p>
                </div>
              </div>

              {/* Right: Diagram Visual */}
              <div className="flex-1">
                <div className="bg-muted/30 rounded-2xl p-8 border border-border">
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 border-l-4 border-primary">
                      <div className="text-sm font-semibold text-label mb-2">Old Internet</div>
                      <div className="text-xs text-secondary-label">SEO • Social • Ads • UTMs</div>
                    </div>
                    <div className="text-center text-2xl text-primary">+</div>
                    <div className="bg-white rounded-lg p-6 border-l-4 border-deepSea">
                      <div className="text-sm font-semibold text-label mb-2">LLM Layer</div>
                      <div className="text-xs text-secondary-label">AI Answers • Context • Recommendations</div>
                    </div>
                    <div className="text-center">
                      <div className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold text-sm">
                        = utm.one
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What Makes Different - With Analytics Visual */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              {/* Left: Content */}
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-label lowercase">
                  what makes utm.one different
                </h2>
                <ProgressiveReveal>
                  <p className="text-lg text-secondary-label italic">
                    minimal on the outside. structured to perfection inside.
                  </p>
                </ProgressiveReveal>
                <ProgressiveReveal>
                  <ul className="space-y-3 text-lg text-secondary-label leading-[1.75]">
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
                      <span>built-in campaign governance</span>
                    </li>
                  </ul>
                </ProgressiveReveal>
              </div>

              {/* Right: Analytics Dashboard */}
              <div className="flex-1 flex justify-center">
                <ProductMockup type="analytics" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Who Is It For - With Links */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[800px] mx-auto px-8">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-label lowercase">
                who is it for
              </h2>
              <div className="space-y-6 text-lg text-secondary-label leading-[1.75]">
                <ProgressiveReveal>
                  <p>
                    creators, marketers, founders, product teams, community builders, growth leaders — anyone who wants:
                  </p>
                </ProgressiveReveal>
                <ProgressiveReveal>
                  <ul className="space-y-3 pl-8">
                    <li>consistent campaign naming</li>
                    <li>beautifully short links</li>
                    <li>metadata that LLMs understand</li>
                    <li>context that improves conversions</li>
                    <li>clarity that scales across teams</li>
                  </ul>
                </ProgressiveReveal>
                
                <div className="grid md:grid-cols-3 gap-4 pt-6">
                  <Link to="/solutions/marketers" className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="text-sm font-semibold text-label mb-1 lowercase">marketers</div>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/solutions/sales" className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="text-sm font-semibold text-label mb-1 lowercase">sales</div>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/solutions/developers" className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="text-sm font-semibold text-label mb-1 lowercase">developers</div>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* The Promise */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-[800px] mx-auto px-8">
          <AnimatedSection>
            <div className="space-y-6 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-label lowercase">
                the promise
              </h2>
              <div className="space-y-6 text-lg text-secondary-label leading-[1.75]">
                <ProgressiveReveal>
                  <p>
                    you'll spend less time fixing broken tracking,<br />
                    and more time crafting better stories.
                  </p>
                </ProgressiveReveal>
                <ProgressiveReveal>
                  <p>
                    because distribution shouldn't feel like a chore.<br />
                    <span className="text-label font-semibold">it should feel like a design choice.</span>
                  </p>
                </ProgressiveReveal>
                <p className="text-xl text-label font-bold pt-6">
                  utm.one is that choice.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
