import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FooterFAQ = () => {
  return (
    <div className="mb-16 pb-16 border-b border-border/50">
      <h2 className="text-3xl md:text-4xl font-display font-bold lowercase text-foreground mb-8">
        frequently asked questions
      </h2>
      
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="what-is" className="border border-border/50 rounded-xl bg-card px-6">
          <AccordionTrigger className="text-lg font-semibold lowercase text-foreground hover:no-underline py-5">
            what is utm.one?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
            <p className="mb-4">
              utm.one is a tracking and link governance layer for modern growth teams.
              it turns every URL you share into a clean, trusted, machine readable link that your analytics can actually rely on.
            </p>
            <p className="mb-4">
              <strong className="text-foreground">goal:</strong> give every link a meaning machines can understand and humans can trust.
            </p>
            <p>
              working alongside your existing tools, utm.one uses the clean-track framework, naming rules, and lightweight governance to standardize UTMs, prevent duplicates, and keep your reporting clean from day one.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="use-cases" className="border border-border/50 rounded-xl bg-card px-6">
          <AccordionTrigger className="text-lg font-semibold lowercase text-foreground hover:no-underline py-5">
            what are the main use cases for utm.one?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
            <p className="mb-4">
              utm.one helps marketing, revops, and product teams create, govern, and track links for:
            </p>
            <ul className="space-y-2 list-disc list-inside mb-4">
              <li>paid campaigns and experiments</li>
              <li>lifecycle and product email</li>
              <li>webinars, events, and communities</li>
              <li>partner and affiliate programs</li>
              <li>sales outreach, demos, and one to one links</li>
              <li>content, social, and influencer distribution</li>
            </ul>
            <p>
              behind the scenes, all of this is using the same syntax, naming rules, and governance, so your dashboards do not break every time someone launches a new campaign.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="clean-track" className="border border-border/50 rounded-xl bg-card px-6">
          <AccordionTrigger className="text-lg font-semibold lowercase text-foreground hover:no-underline py-5">
            what is clean-track? how does it work inside utm.one?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
            <p className="mb-4">
              most teams do not fail because UTMs are hard. they fail because UTMs are unmanaged.
            </p>
            <p className="mb-4">
              clean-track is the four layer framework behind utm.one:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-1 lowercase">syntax layer</h4>
                <p>defines which UTM parameters you can use, how they should look, and in what order.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1 lowercase">naming rules layer</h4>
                <p>defines the naming patterns for source, medium, campaign, audience, objective, and variant.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1 lowercase">governance layer</h4>
                <p>defines who can create links, who reviews them, and how often audits happen.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1 lowercase">reporting layer</h4>
                <p>defines how links and UTMs roll up into channels, campaigns, spend, pipeline, and revenue.</p>
              </div>
            </div>
            <p className="mt-4">
              utm.one bakes clean-track into the product so every link you create is structurally correct, consistently named, governance friendly, and ready for reporting.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="problems" className="border border-border/50 rounded-xl bg-card px-6">
          <AccordionTrigger className="text-lg font-semibold lowercase text-foreground hover:no-underline py-5">
            what problems does utm.one actually solve day to day?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
            <p className="mb-4 font-semibold text-foreground lowercase">no more:</p>
            <ul className="space-y-2 list-disc list-inside mb-4">
              <li>random google / cpc / test123 campaigns</li>
              <li>duplicate short links pointing at the same thing</li>
              <li>"who created this link and why" in your CRM</li>
              <li>mismatched numbers between ads manager and BI</li>
              <li>manual spreadsheet cleanups before every board deck</li>
            </ul>
            <p className="mb-4 font-semibold text-foreground lowercase">instead you get:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>one place to create and govern short links</li>
              <li>one shared naming system that everyone follows</li>
              <li>one clean pipeline of data into analytics and finance</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="best-for" className="border border-border/50 rounded-xl bg-card px-6">
          <AccordionTrigger className="text-lg font-semibold lowercase text-foreground hover:no-underline py-5">
            who is utm.one best for?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
            <p className="mb-4">
              utm.one is built for growth teams that care about data quality as much as they care about creative:
            </p>
            <ul className="space-y-2 list-disc list-inside mb-4">
              <li>b2b SaaS and product led companies</li>
              <li>performance and growth marketers</li>
              <li>revenue operations and analytics teams</li>
              <li>agencies managing multiple client accounts</li>
              <li>teams with multiple markets, products, or segments</li>
            </ul>
            <p>
              if you are already fighting over "which dashboard is right" or fixing broken UTMs before every big review, you are the right fit.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="existing-tools" className="border border-border/50 rounded-xl bg-card px-6">
          <AccordionTrigger className="text-lg font-semibold lowercase text-foreground hover:no-underline py-5">
            how does utm.one work with my existing tools?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
            <p className="mb-4">
              utm.one is designed to sit quietly in your stack and make everything else better, not replace it.
            </p>
            <ul className="space-y-2 list-disc list-inside mb-4">
              <li>lives between your content and your analytics</li>
              <li>standardizes links before they hit GA4, ad platforms, and BI</li>
              <li>writes clean metadata that your CRM and warehouse can use</li>
              <li>plays nicely with spreadsheets, clay like workflows, and automation tools</li>
            </ul>
            <p>
              you keep your current tools. utm.one makes the data they see much cleaner.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pricing" className="border border-border/50 rounded-xl bg-card px-6">
          <AccordionTrigger className="text-lg font-semibold lowercase text-foreground hover:no-underline py-5">
            what about pricing?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
            <p className="mb-4">
              utm.one is in early access.
              we are working with a small set of design partners and early teams to shape the product, integrations, and pricing together.
            </p>
            <p>
              the goal is simple: a model that scales with your volume and seats without punishing you for using clean tracking everywhere.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="early-access" className="border border-border/50 rounded-xl bg-card px-6">
          <AccordionTrigger className="text-lg font-semibold lowercase text-foreground hover:no-underline py-5">
            can i try it or join early access?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
            <p className="mb-4">
              yes. we are running a closed early access program with:
            </p>
            <ul className="space-y-2 list-disc list-inside mb-4">
              <li>priority onboarding</li>
              <li>help setting up your clean-track rules</li>
              <li>feedback loops directly into the roadmap</li>
            </ul>
            <p>
              if you want cleaner links, cleaner UTMs, and calmer dashboards, you can join the waitlist and we will reach out as we open new slots.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
