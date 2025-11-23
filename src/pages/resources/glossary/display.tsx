import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const DisplayTerm = () => {
  return (
    <GlossaryTermLayout
      term="Display Advertising"
      category="Marketing Channels"
      quickDefinition="Visual banner ads (image, video, rich media) shown on websites, apps, and ad networks, typically charged per impression (CPM) rather than per click."
      fullDefinition={[
        "Display Advertising refers to visual advertisements shown on websites, mobile apps, and ad networks across the internet. Unlike text-based search ads, display ads use images, animations, video, and rich media to capture attention. Major platforms include Google Display Network (GDN), Facebook Audience Network, and programmatic ad exchanges.",
        "Display ads are charged primarily on CPM (cost per thousand impressions) rather than CPC (cost per click), making them better for brand awareness than direct response. Targeting options include contextual (show ads on relevant content sites), behavioral (target users based on browsing history), demographic (age, gender, income), and retargeting (users who visited your site).",
        "Display advertising excels at top-of-funnel awareness, visual storytelling, retargeting website visitors, and reaching audiences across the web. However, display typically has low click-through rates (0.1-0.5%) and higher fraud risk (bot traffic) compared to search advertising. Creative quality and frequency capping are critical for performance.",
        "In UTM structure, use utm_medium=display with utm_source=gdn (Google Display Network), utm_source=programmatic, etc. Critical to segment campaigns by objective (awareness vs retargeting), ad format (banner vs video vs native), and placement type (contextual vs behavioral vs retargeting) for proper attribution analysis."
      ]}
      whenToUse="Use display for building brand awareness in new markets, retargeting website visitors who didn't convert, launching visual products that benefit from rich media, reaching audiences across the web at scale, or supplementing search campaigns with visual presence."
      whenNotToUse="Don't use display as primary direct-response channel (low CTR vs search), with weak creative assets (boring banners get ignored), without frequency capping (ad fatigue kills performance), for immediate lead generation (better channels exist), or when budget is limited (requires scale for effectiveness)."
      commonMistakes={[
        "Using utm_medium=cpc for display campaigns (should be display to differentiate from search)",
        "Not separating prospecting and retargeting campaigns in UTM structure (vastly different economics)",
        "Running display campaigns without frequency capping (showing same ad 50x kills brand perception)",
        "Not testing multiple creative variants (single creative fatigues quickly)",
        "Optimizing for clicks instead of downstream conversions (cheap clicks don't always convert)"
      ]}
      goodExamples={[
        "utm_source=gdn&utm_medium=display&utm_campaign=brand-awareness-us&utm_content=animated-banner-v1&utm_term=contextual-saas",
        "utm_source=programmatic&utm_medium=display&utm_campaign=retargeting-cart-abandonment&utm_content=dynamic-product-ad&utm_term=",
        "utm_source=facebook-audience-network&utm_medium=display&utm_campaign=lookalike-expansion&utm_content=video-testimonial&utm_term=",
        "Segmenting contextual prospecting, behavioral targeting, and retargeting into separate campaigns for attribution clarity"
      ]}
      badExamples={[
        "utm_medium=cpc for banner ads (confuses with search ads which are also CPC)",
        "Lumping awareness and retargeting display together (can't optimize without segmentation)",
        "Not tracking creative variant in utm_content (can't determine which ad formats work)",
        "Using utm_term=banner-300x250 (that's format not targeting - should track audience segment)"
      ]}
      relatedTerms={[
        { slug: "paid-search", term: "Paid Search (CPC/PPC)", category: "Marketing Channels" },
        { slug: "paid-social", term: "Paid Social", category: "Marketing Channels" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "medium", term: "utm_medium", category: "Core Tracking" },
        { slug: "content", term: "utm_content", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "UTM Examples", url: "/resources/examples/utm", type: "examples" },
        { title: "Campaign Brief Template", url: "/resources/templates/campaign-brief", type: "template" },
        { title: "Naming Convention Playbook", url: "/resources/playbooks/naming-convention", type: "playbook" }
      ]}
    />
  );
};

export default DisplayTerm;
