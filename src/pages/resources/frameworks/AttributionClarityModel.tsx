import { Navigation } from "@/components/landing/Navigation";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, FileText, Settings } from "lucide-react";
import { FrameworkPrinciple } from "@/components/resources/FrameworkPrinciple";
import { ImplementationRoadmap } from "@/components/resources/ImplementationRoadmap";
import { ActionChecklist } from "@/components/resources/ActionChecklist";

const AttributionClarityModel = () => {
  const questions = [
    {
      number: 1,
      title: "Which channels are worth doubling down on?",
      description: "Performance-focused view showing which marketing investments generate the best returns."
    },
    {
      number: 2,
      title: "Which campaigns create quality opportunities/customers?",
      description: "Quality-focused view distinguishing campaigns that drive real business outcomes from vanity metrics."
    },
    {
      number: 3,
      title: "How should we balance brand vs performance investment?",
      description: "Strategic view helping allocate budget between long-term brand building and short-term conversion."
    }
  ];

  const layers = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      number: "01",
      title: "Data Integrity",
      description: "If your tracking is broken, attribution is broken. Fix UTMs, events, and ID connections first.",
      key: "foundation layer"
    },
    {
      icon: <Eye className="w-6 h-6 text-primary" />,
      number: "02",
      title: "Views (Models)",
      description: "First-touch, last-touch, multi-touch, position-based. Choose 2-3 views, not 10.",
      key: "analytical layer"
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      number: "03",
      title: "Communication",
      description: "How the rules are documented and explained to teams. One-page attribution memo required.",
      key: "transparency layer"
    },
    {
      icon: <Settings className="w-6 h-6 text-primary" />,
      number: "04",
      title: "Governance & Usage",
      description: "How often views are reviewed, by whom, and for what decisions. Quarterly reviews minimum.",
      key: "operational layer"
    }
  ];

  const roadmap = [
    {
      phase: "Weeks 1-2",
      duration: "foundation",
      title: "Fix data integrity",
      tasks: [
        "Audit current UTM and event tracking",
        "Ensure IDs are connectable across systems",
        "Define trust boundary date",
        "Document data quality baseline"
      ]
    },
    {
      phase: "Weeks 3-4",
      duration: "models",
      title: "Choose and implement views",
      tasks: [
        "Select primary performance view (last non-direct touch)",
        "Add strategic view (first-touch)",
        "Optionally add multi-touch view",
        "Document model definitions and exclusions"
      ]
    },
    {
      phase: "Weeks 5-6",
      duration: "communication",
      title: "Document and communicate",
      tasks: [
        "Write one-page attribution memo",
        "Present to leadership and teams",
        "Add to internal wiki/docs",
        "Train teams on how to use each view"
      ]
    },
    {
      phase: "Weeks 7-10",
      duration: "governance",
      title: "Set governance rhythm",
      tasks: [
        "Assign attribution owner",
        "Schedule quarterly reviews",
        "Tie to budget planning cycle",
        "Iterate based on actual usage"
      ]
    }
  ];

  const modelGuide = [
    {
      model: "Last Non-Direct Touch (90-day lookback)",
      bestFor: "Performance marketing, B2B SaaS, demand gen teams",
      pros: "Pragmatic, actionable, rewards last meaningful push",
      cons: "Undervalues early brand touchpoints"
    },
    {
      model: "First-Touch",
      bestFor: "Brand teams, top-of-funnel strategy, awareness campaigns",
      pros: "Credits discovery channels, good for brand investment questions",
      cons: "Ignores nurture and conversion efforts"
    },
    {
      model: "Multi-Touch (Linear or Position-Based)",
      bestFor: "Sophisticated teams with long sales cycles and rich data",
      pros: "Distributes credit across journey, more nuanced view",
      cons: "Complex, requires more data, harder to explain"
    }
  ];

  const pitfalls = [
    {
      pitfall: "Over-precision (claiming 73.4% accuracy)",
      why: "Attribution is inherently uncertain, false precision erodes trust",
      fix: "Use ranges and confidence levels, acknowledge limitations"
    },
    {
      pitfall: "Constant model changes",
      why: "Breaks trust and makes year-over-year comparisons impossible",
      fix: "Commit to one model for minimum 6 months"
    },
    {
      pitfall: "Ignoring offline/untrackable channels",
      why: "Creates blind spots and undervalues non-digital activities",
      fix: "Use surveys and incremental lift tests to estimate"
    },
    {
      pitfall: "Political fights over credit allocation",
      why: "Teams game attribution to claim budget, destroys collaboration",
      fix: "Use attribution for questions, not blame; budget uses multiple views"
    }
  ];

  const checklistItems = [
    { id: "1", text: "UTM and event tracking are consistent and reliable" },
    { id: "2", text: "User IDs connect across CRM, product, and marketing systems" },
    { id: "3", text: "Trust boundary date is defined ('reliable from Q1 2024 onward')" },
    { id: "4", text: "Primary performance view is chosen and documented" },
    { id: "5", text: "Strategic/complementary view is chosen and documented" },
    { id: "6", text: "One-page attribution memo exists and is accessible" },
    { id: "7", text: "Teams are trained on how to interpret each view" },
    { id: "8", text: "Attribution owner is assigned" },
    { id: "9", text: "Quarterly review process is scheduled" },
    { id: "10", text: "Attribution tied to budget process without political fights" },
    { id: "11", text: "Model limitations are openly acknowledged" },
    { id: "12", text: "Attribution used for questions, not blame" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-background border-b border-border/50">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources/frameworks"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            back to frameworks
          </Link>
          
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 bg-primary/10 text-primary">
              decision framework
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold hero-gradient lowercase">
              attribution clarity model
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
              four-layer framework for aligning teams on marketing attribution without political fights over credit.
            </p>
          </div>
        </div>
      </section>

      {/* What Attribution Clarity Means */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-8">
            what attribution clarity really means
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
                ❌ not this
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200">
                Everyone agrees on one perfect number
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                ✅ instead, this
              </h3>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <li>• Everyone understands how numbers are produced</li>
                <li>• Everyone knows the limitations</li>
                <li>• Data used consistently for decisions</li>
              </ul>
            </div>
            
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                🎯 the goal
              </h3>
              <p className="text-sm text-foreground/80">
                Move from "mysterious black box" to "transparent set of views we all understand"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Questions */}
      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-12">
            the three questions attribution must answer
          </h2>
          
          <div className="space-y-6">
            {questions.map((question, index) => (
              <FrameworkPrinciple
                key={index}
                number={question.number}
                title={question.title}
                description={question.description}
                delay={index * 0.1}
              />
            ))}
          </div>
          
          <p className="text-base text-muted-foreground mt-8 max-w-[720px]">
            Any attribution setup that doesn't help answer these with more clarity isn't worth maintaining.
          </p>
        </div>
      </section>

      {/* The 4 Attribution Layers */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-12">
            the four attribution layers
          </h2>
          
          <div className="space-y-6">
            {layers.map((layer, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border/50 hover:border-white/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
                    {layer.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-5xl font-extrabold text-primary/10">
                        {layer.number}
                      </span>
                      <h3 className="text-2xl font-display font-semibold text-foreground">
                        {layer.title}
                      </h3>
                    </div>
                    <p className="text-base text-muted-foreground mb-2">
                      {layer.description}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {layer.key}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Pick Models */}
      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-6">
            how to pick attribution models
          </h2>
          <p className="text-base text-muted-foreground mb-12">
            You don't need one "perfect" model. You need a small set of views aligned with your questions.
          </p>
          
          <div className="space-y-6">
            {modelGuide.map((model, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border/50"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {model.model}
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">Best for:</p>
                    <p className="text-foreground">{model.bestFor}</p>
                  </div>
                  <div>
                    <p className="text-green-600 dark:text-green-400 font-medium mb-1">Pros:</p>
                    <p className="text-foreground">{model.pros}</p>
                  </div>
                  <div>
                    <p className="text-red-600 dark:text-red-400 font-medium mb-1">Cons:</p>
                    <p className="text-foreground">{model.cons}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Roadmap */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <ImplementationRoadmap phases={roadmap} />
        </div>
      </section>

      {/* Common Pitfalls */}
      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-12">
            common pitfalls
          </h2>
          
          <div className="space-y-6">
            {pitfalls.map((item, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border/50"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  ⚠️ {item.pitfall}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Why it breaks:</strong> {item.why}
                </p>
                <p className="text-sm text-primary">
                  <strong>Fix:</strong> {item.fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Checklist */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-6">
            attribution clarity checklist
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            You need 9 of 12 to confidently say you have attribution clarity.
          </p>
          
          <ActionChecklist
            items={checklistItems}
            storageKey="attribution-clarity-checklist"
            className="max-w-[720px]"
          />
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-20 bg-background border-t border-border/50">
        <div className="max-w-[980px] mx-auto px-8">
          <h2 className="text-2xl font-display font-semibold text-foreground mb-8">
            related resources
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/resources/guides/growth-analytics"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Growth Analytics Guide</h3>
              <p className="text-sm text-muted-foreground">Measure marketing influence on revenue growth</p>
            </Link>
            
            <Link
              to="/resources/guides/utm-guide"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">UTM Guide</h3>
              <p className="text-sm text-muted-foreground">Build tracking foundation for attribution</p>
            </Link>
            
            <Link
              to="/resources/guides/tracking-architecture"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Tracking Architecture Guide</h3>
              <p className="text-sm text-muted-foreground">Design systems that enable attribution</p>
            </Link>
            
            <Link
              to="/resources/frameworks/clean-track-model"
              className="block p-6 bg-card rounded-xl border border-border/50 hover:border-white/20 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Clean-Track Framework</h3>
              <p className="text-sm text-muted-foreground">Ensure data quality feeds attribution models</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-background">
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

export default AttributionClarityModel;