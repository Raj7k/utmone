import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const DirectTerm = () => {
  return (
    <GlossaryTermLayout
      term="Direct Traffic"
      category="Marketing Channels"
      quickDefinition="Website visitors who arrive by typing URL directly into browser, using bookmarks, or clicking links without referrer data (email clients, messaging apps, PDFs)."
      fullDefinition={[
        "Direct Traffic in web analytics represents visits where the traffic source cannot be identified—either because the user typed the URL directly, used a bookmark, or clicked a link from a source that doesn't pass referrer information (email clients, messaging apps, PDF documents, HTTPS→HTTP transitions).",
        "In Google Analytics, direct traffic shows as source=(direct) and medium=(direct). While some direct traffic is genuinely direct (user typing utm.one into browser), much of it is actually mislabeled traffic from trackable sources where UTM parameters were missing or referrer data was stripped. This makes direct traffic a 'catch-all bucket' for attribution failures.",
        "Common causes of false direct attribution include: missing UTM parameters on email links, links shared in messaging apps (WhatsApp, Slack), links in mobile apps, links in PDF documents, HTTPS→HTTP redirect issues, browser security settings blocking referrers, and shortened URLs without tracking. Studies suggest 50-80% of direct traffic is actually misattributed traffic from other sources.",
        "To reduce false direct attribution: use UTM parameters on all marketing links (emails, social, QR codes, offline materials), implement proper HTTPS across entire site, add tracking to shortened URLs, test link tracking from common sources, and monitor 'direct' spikes after campaigns (likely untracked campaign traffic)."
      ]}
      whenToUse="Treat direct traffic as authentic when analyzing brand awareness (users typing URL from memory), bookmark usage (returning visitors), offline campaign effectiveness (users saw billboard/TV ad), or when measuring overall brand strength and recall."
      whenNotToUse="Don't rely on direct traffic attribution for campaign performance (usually mislabeled), channel ROI decisions (mixed bag of sources), or assume it's all 'good' traffic (includes misattribution and bot traffic)."
      commonMistakes={[
        "Assuming all direct traffic is genuinely direct (50-80% is likely misattributed from other sources)",
        "Not using UTM parameters on email marketing links (becomes 'direct' traffic)",
        "Forgetting UTM parameters on QR codes and offline materials (all shows as direct)",
        "Not tracking short links with UTM parameters (shortened URL clicks become direct)",
        "Celebrating spikes in 'direct' after campaign launches (usually means your tracking is broken)"
      ]}
      goodExamples={[
        "Monitoring direct traffic after offline campaign (billboard, TV, radio) to measure brand recall lift",
        "Analyzing direct traffic patterns to understand returning visitor behavior and bookmark usage",
        "Investigating unexpected direct traffic spikes to find tracking gaps in campaigns",
        "Comparing direct traffic percentage over time to identify degrading tracking infrastructure"
      ]}
      badExamples={[
        "Treating all direct traffic as high-quality brand-aware visitors (much is misattributed)",
        "Not investigating why 50%+ of traffic shows as direct (probably tracking issues)",
        "Forgetting UTM parameters on newsletter links and seeing traffic spike in 'direct'",
        "Using direct traffic metrics to justify brand campaign ROI (mixed attribution makes it meaningless)"
      ]}
      relatedTerms={[
        { slug: "referral", term: "Referral Traffic", category: "Marketing Channels" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "source", term: "utm_source", category: "Core Tracking" },
        { slug: "qr-code", term: "QR Code", category: "Operational" },
        { slug: "link-shortener", term: "Link Shortener", category: "Operational" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" },
        { title: "Clean-Track Framework", url: "/resources/guides/clean-track", type: "guide" },
        { title: "UTM Template", url: "/resources/templates/utm", type: "template" }
      ]}
    />
  );
};

export default DirectTerm;
