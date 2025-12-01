import { useState, useMemo } from "react";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { FAQSearchFilter } from "@/components/resources/FAQSearchFilter";
import { Link } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlossaryTooltip } from "@/components/llm/GlossaryTooltip";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: string;
  tags: string[];
}

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Comprehensive FAQ Data
  const allFAQs: FAQItem[] = [
    // ========== GETTING STARTED ==========
    {
      question: "what is utm.one?",
      category: "getting started",
      tags: ["beginner", "popular"],
      answer: (
        <div className="space-y-4">
          <p>
            utm.one is a tracking and link governance layer for modern growth teams. it turns every url into a clean, trusted, machine-readable link using the clean-track framework.
          </p>
          <p>
            we help marketing, sales, and operations teams maintain consistent utms, branded qr codes, and comprehensive analytics across all campaigns.
          </p>
        </div>
      ),
    },
    {
      question: "how do i create an account?",
      category: "getting started",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            you can sign up in seconds using email/password, google, or microsoft oauth. no credit card required for the free plan.
          </p>
          <p>
            once signed in, you'll go through a quick onboarding wizard to set up your workspace and create your first link.
          </p>
        </div>
      ),
    },
    {
      question: "what happens during onboarding?",
      category: "getting started",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            onboarding walks you through 4 quick steps:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>workspace setup (name your team)</li>
            <li>custom domain configuration (optional)</li>
            <li>tracking pixel installation (critical for conversions)</li>
            <li>creating your first link</li>
          </ul>
          <p>
            the entire process takes less than 5 minutes, and you can skip steps if needed.
          </p>
        </div>
      ),
    },
    {
      question: "how do i create my first link?",
      category: "getting started",
      tags: ["beginner", "popular"],
      answer: (
        <div className="space-y-4">
          <p>
            from your dashboard, click "create link" and provide:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>destination url (where the link redirects)</li>
            <li>custom slug (the short part, like "abc123")</li>
            <li>title (internal name for your team)</li>
            <li>utm parameters (recommended for tracking)</li>
          </ul>
          <p>
            your link is live instantly and ready to share.
          </p>
        </div>
      ),
    },
    {
      question: "what's the onboarding checklist?",
      category: "getting started",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            the onboarding checklist tracks 6 key milestones:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>create your first link</li>
            <li>generate a qr code</li>
            <li>view analytics</li>
            <li>invite a team member</li>
            <li>set up custom domain</li>
            <li>install tracking pixel</li>
          </ul>
          <p>
            complete all 6 to unlock the full power of utm.one. you'll see confetti when you're done!
          </p>
        </div>
      ),
    },
    {
      question: "why do i need to install the tracking pixel?",
      category: "getting started",
      tags: ["beginner", "technical"],
      answer: (
        <div className="space-y-4">
          <p className="text-amber-600 dark:text-amber-400 font-medium">
            ⚠️ without the tracking pixel, you won't be able to track conversions.
          </p>
          <p>
            the pixel is a small javascript snippet you paste into your website's &lt;head&gt; tag. it connects clicks to conversions (leads, purchases, signups) so you can see full-funnel attribution.
          </p>
          <p>
            without it, you'll only see clicks—not what happens after the click.
          </p>
        </div>
      ),
    },
    {
      question: "can i use utm.one without signing up?",
      category: "getting started",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! we have free public tools at /tools including:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>utm builder (basic)</li>
            <li>qr code generator (with utm.one watermark)</li>
            <li>url shortener (basic)</li>
          </ul>
          <p>
            signing up unlocks watermark removal, analytics, team collaboration, and advanced features.
          </p>
        </div>
      ),
    },
    {
      question: "what browsers are supported?",
      category: "getting started",
      tags: ["technical"],
      answer: (
        <div className="space-y-4">
          <p>
            utm.one works on all modern browsers:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>chrome, edge, brave (chromium-based)</li>
            <li>firefox</li>
            <li>safari (mac, ios)</li>
          </ul>
          <p>
            we also support full keyboard navigation and screen readers (wcag aaa compliant).
          </p>
        </div>
      ),
    },

    // ========== LINKS & SHORT URLS ==========
    {
      question: "how do i create a short link?",
      category: "links & short urls",
      tags: ["beginner", "popular"],
      answer: (
        <div className="space-y-4">
          <p>
            click "create link" from your dashboard. you can also use quick actions tile or the "+" button in the sidebar.
          </p>
          <p>
            provide a destination url, custom slug (or let us auto-generate one), title, and optional utm parameters. your link is live instantly.
          </p>
        </div>
      ),
    },
    {
      question: "can i customize my link slug?",
      category: "links & short urls",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! you can choose between two modes:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>descriptive:</strong> auto-generates semantic slug from page title (e.g., "pricing-page")</li>
            <li><strong>random:</strong> creates short, random slug (e.g., "x7k2p")</li>
          </ul>
          <p>
            or type your own custom slug. slugs are permanent once created.
          </p>
        </div>
      ),
    },
    {
      question: "what makes a good slug?",
      category: "links & short urls",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            good slugs are:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>short:</strong> easier to type and share</li>
            <li><strong>memorable:</strong> descriptive if possible (e.g., "summer-sale")</li>
            <li><strong>consistent:</strong> use naming conventions (e.g., all-lowercase)</li>
          </ul>
          <p>
            avoid special characters, spaces, or urls that look like spam.
          </p>
        </div>
      ),
    },
    {
      question: "can i edit a link after creating it?",
      category: "links & short urls",
      tags: ["popular"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! you can edit:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>destination url</li>
            <li>title and description</li>
            <li>utm parameters</li>
            <li>expiration date or click limit</li>
          </ul>
          <p>
            the short url slug cannot be changed to preserve link integrity. if you need a different slug, create a new link.
          </p>
        </div>
      ),
    },
    {
      question: "do my links expire?",
      category: "links & short urls",
      tags: ["popular"],
      answer: (
        <div className="space-y-4">
          <p>
            links are permanent by default and will work forever unless you:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>set an expiration date</li>
            <li>set a maximum click limit (1 - 10 million)</li>
            <li>manually pause or archive the link</li>
          </ul>
          <p>
            we guarantee link permanence even if our service shuts down through our self-hosting option.
          </p>
        </div>
      ),
    },
    {
      question: "how do i set a click limit?",
      category: "links & short urls",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            when creating or editing a link, enter a value in the "max clicks" field (1 - 10,000,000).
          </p>
          <p>
            once the limit is reached, the link will stop redirecting and show a "limit reached" message.
          </p>
          <p>
            leave the field empty for unlimited clicks.
          </p>
        </div>
      ),
    },
    {
      question: "what is link status (active/paused/archived)?",
      category: "links & short urls",
      tags: [],
      answer: (
        <div className="space-y-4">
          <ul className="list-disc list-inside space-y-2">
            <li><strong>active:</strong> link is live and redirecting</li>
            <li><strong>paused:</strong> temporarily disabled, can be resumed</li>
            <li><strong>archived:</strong> removed from active lists but still accessible in archives</li>
          </ul>
          <p>
            pausing is useful for seasonal campaigns. archiving keeps your dashboard clean without deleting data.
          </p>
        </div>
      ),
    },
    {
      question: "can i bulk create multiple links?",
      category: "links & short urls",
      tags: ["advanced", "pro-only"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! use the bulk url shortener at /dashboard/bulk-create.
          </p>
          <p>
            paste multiple urls (one per line) or import a csv/excel file. utm.one will:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>auto-generate slugs from page titles</li>
            <li>detect duplicates</li>
            <li>apply utm templates</li>
            <li>create all links in seconds</li>
          </ul>
          <p>
            available on pro plan and higher.
          </p>
        </div>
      ),
    },
    {
      question: "how do i delete a link?",
      category: "links & short urls",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            from the link detail page or links table, click the "..." menu and select "delete."
          </p>
          <p className="text-amber-600 dark:text-amber-400 font-medium">
            ⚠️ deletion is permanent. the short url will stop working immediately.
          </p>
          <p>
            consider archiving instead if you want to preserve analytics while removing from active lists.
          </p>
        </div>
      ),
    },
    {
      question: "what happens if i delete a link?",
      category: "links & short urls",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            when you delete a link:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>the short url stops redirecting</li>
            <li>historical analytics are preserved</li>
            <li>qr codes stop working</li>
            <li>the slug becomes available for reuse</li>
          </ul>
          <p>
            deletion cannot be undone.
          </p>
        </div>
      ),
    },
    {
      question: "can i duplicate a link?",
      category: "links & short urls",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            yes! from the link detail page or links table, click "..." → "duplicate."
          </p>
          <p>
            this creates an exact copy with all utms, settings, and metadata. you'll need to provide a new slug.
          </p>
          <p>
            useful for creating variants or a/b tests.
          </p>
        </div>
      ),
    },
    {
      question: "how many links can i create?",
      category: "links & short urls",
      tags: ["billing"],
      answer: (
        <div className="space-y-4">
          <p>
            limits by plan:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>free:</strong> 100 links</li>
            <li><strong>pro:</strong> 1,000 links</li>
            <li><strong>business:</strong> 10,000 links</li>
            <li><strong>enterprise:</strong> unlimited</li>
          </ul>
          <p>
            archived links count toward your total. when you hit your limit, you'll be prompted to upgrade.
          </p>
        </div>
      ),
    },

    // ========== UTM PARAMETERS ==========
    {
      question: "what are utm parameters?",
      category: "utm parameters",
      tags: ["beginner", "popular"],
      answer: (
        <div className="space-y-4">
          <p>
            <GlossaryTooltip term="utm parameters" inline /> are tags added to urls to track campaign performance in google analytics and other analytics platforms.
          </p>
          <p>
            the five parameters are:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>utm_source:</strong> where traffic originates (e.g., google, newsletter)</li>
            <li><strong>utm_medium:</strong> marketing medium (e.g., email, social, cpc)</li>
            <li><strong>utm_campaign:</strong> campaign name (e.g., summer-sale-2024)</li>
            <li><strong>utm_term:</strong> paid keywords (optional)</li>
            <li><strong>utm_content:</strong> content differentiation (optional)</li>
          </ul>
        </div>
      ),
    },
    {
      question: "why should i use utm parameters?",
      category: "utm parameters",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            utm parameters let you:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>track which campaigns drive traffic and conversions</li>
            <li>compare performance across channels (email vs social vs paid)</li>
            <li>see roi for each marketing dollar spent</li>
            <li>make data-driven decisions instead of guessing</li>
          </ul>
          <p>
            without utms, all traffic looks the same in analytics—you can't tell what's working.
          </p>
        </div>
      ),
    },
    {
      question: "what are the 5 utm fields?",
      category: "utm parameters",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>utm_source:</strong> traffic source (e.g., google, newsletter, facebook)</li>
            <li><strong>utm_medium:</strong> marketing medium (e.g., cpc, email, social)</li>
            <li><strong>utm_campaign:</strong> campaign identifier (e.g., summer-sale-2024)</li>
            <li><strong>utm_term:</strong> paid search keywords (optional)</li>
            <li><strong>utm_content:</strong> ad variant or content differentiator (optional)</li>
          </ol>
          <p>
            source, medium, and campaign are required. term and content are optional but useful for a/b testing.
          </p>
        </div>
      ),
    },
    {
      question: "can i save utm templates?",
      category: "utm parameters",
      tags: ["advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! utm templates let you enforce consistent naming conventions across your team.
          </p>
          <p>
            for example, create a template called "email-campaigns" with:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>utm_source: newsletter</li>
            <li>utm_medium: email</li>
            <li>utm_campaign: [dynamic]</li>
          </ul>
          <p>
            team members select the template and only fill in campaign name. no more inconsistent utms!
          </p>
        </div>
      ),
    },
    {
      question: "how do i enforce utm naming conventions?",
      category: "utm parameters",
      tags: ["advanced", "business-only"],
      answer: (
        <div className="space-y-4">
          <p>
            workspace admins can set naming rules:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>required fields (e.g., source + medium + campaign mandatory)</li>
            <li>allowed values (e.g., utm_medium must be "email" or "social" or "cpc")</li>
            <li>naming patterns (e.g., campaign must follow "[channel]-[region]-[product]-[monthyear]")</li>
          </ul>
          <p>
            available on business and enterprise plans.
          </p>
        </div>
      ),
    },
    {
      question: "what's the smart utm autocomplete?",
      category: "utm parameters",
      tags: ["new-feature", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            utm.one analyzes your historical link performance and predicts which utm combinations drive the most clicks.
          </p>
          <p>
            when building utms, you'll see:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>🔥 <strong>high impact:</strong> this utm combo historically gets 2x+ average ctr</li>
            <li>gray <strong>average:</strong> typical performance</li>
            <li>yellow <strong>new:</strong> no historical data yet</li>
          </ul>
          <p>
            it's like having a data analyst suggesting your utms.
          </p>
        </div>
      ),
    },
    {
      question: "can utm.one auto-suggest utm values?",
      category: "utm parameters",
      tags: ["advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! as you type, utm.one shows suggestions based on:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>your team's historical utms</li>
            <li>performance data (high-performing combos highlighted)</li>
            <li>templates and naming conventions</li>
          </ul>
          <p>
            this prevents typos and inconsistencies while speeding up link creation.
          </p>
        </div>
      ),
    },
    {
      question: "how do utm parameters appear in google analytics?",
      category: "utm parameters",
      tags: ["technical"],
      answer: (
        <div className="space-y-4">
          <p>
            in google analytics (ga4), utms appear under:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>reports → acquisition → traffic acquisition:</strong> see source/medium breakdown</li>
            <li><strong>reports → acquisition → user acquisition:</strong> see campaign performance</li>
            <li><strong>explore → free form:</strong> build custom reports with utm dimensions</li>
          </ul>
          <p>
            utm parameters are automatically tracked—no setup required beyond installing ga4.
          </p>
        </div>
      ),
    },

    // ========== QR CODES ==========
    {
      question: "how do i generate a qr code?",
      category: "qr codes",
      tags: ["beginner", "popular"],
      answer: (
        <div className="space-y-4">
          <p>
            every short link can generate multiple branded qr code variants.
          </p>
          <p>
            from the link detail page, click "generate qr code" and customize:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>brand colors (primary/secondary)</li>
            <li>logo upload and placement</li>
            <li>corner style (square, rounded, dots)</li>
            <li>frame text</li>
            <li>export format (png, svg, pdf)</li>
          </ul>
        </div>
      ),
    },
    {
      question: "can i customize my qr code colors?",
      category: "qr codes",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! you can set:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>primary color (qr modules)</li>
            <li>secondary color (background)</li>
            <li>gradient overlays (pro/business)</li>
            <li>logo placement with transparency</li>
          </ul>
          <p>
            free users get basic color customization. pro+ unlocks gradients and advanced styling.
          </p>
        </div>
      ),
    },
    {
      question: "can i add my logo to the qr code?",
      category: "qr codes",
      tags: ["pro-only"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! pro and higher plans let you upload your logo and place it in the center of the qr code.
          </p>
          <p>
            utm.one automatically sizes and optimizes your logo to maintain scannability while keeping brand identity visible.
          </p>
        </div>
      ),
    },
    {
      question: "what export formats are available?",
      category: "qr codes",
      tags: [],
      answer: (
        <div className="space-y-4">
          <ul className="list-disc list-inside space-y-2">
            <li><strong>png:</strong> standard raster format, good for web and print</li>
            <li><strong>svg:</strong> vector format, scales infinitely without quality loss (pro+)</li>
            <li><strong>pdf:</strong> print-ready format with bleed and crop marks (business+)</li>
          </ul>
          <p>
            free users get png only. upgrade for svg and pdf.
          </p>
        </div>
      ),
    },
    {
      question: "what's the utm.one watermark?",
      category: "qr codes",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            free users have a small "powered by utm.one" watermark on generated qr codes.
          </p>
          <p>
            this is our lead generation funnel—it drives signups by showing utm.one to people who scan the code.
          </p>
          <p>
            upgrade to pro to remove the watermark and use white-label qr codes.
          </p>
        </div>
      ),
    },
    {
      question: "how do i remove the qr watermark?",
      category: "qr codes",
      tags: ["pro-only"],
      answer: (
        <div className="space-y-4">
          <p>
            upgrade to pro ($20/month) or higher to unlock watermark removal.
          </p>
          <p>
            once upgraded, all new qr codes will be generated without the utm.one branding. existing codes will need to be regenerated.
          </p>
        </div>
      ),
    },
    {
      question: "can i track qr code scans separately?",
      category: "qr codes",
      tags: ["advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! each qr code variant has its own tracking id, allowing you to see performance by qr code placement.
          </p>
          <p>
            for example, track "booth-left-standee" vs "booth-right-standee" to optimize your event setup.
          </p>
          <p>
            this is done via utm_content parameter variation.
          </p>
        </div>
      ),
    },
    {
      question: "what qr code resolution should i use for print?",
      category: "qr codes",
      tags: ["technical"],
      answer: (
        <div className="space-y-4">
          <p>
            for print materials:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>business cards:</strong> 500x500px minimum</li>
            <li><strong>posters/standees:</strong> 1000x1000px or higher</li>
            <li><strong>billboards:</strong> use svg format for infinite scaling</li>
          </ul>
          <p>
            utm.one generates high-resolution qr codes optimized for both digital and print use.
          </p>
        </div>
      ),
    },
    {
      question: "how many qr codes can i generate?",
      category: "qr codes",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            qr code generation is unlimited on all plans!
          </p>
          <p>
            each link can have multiple qr variants (different colors, logos, styles) for different placements or campaigns.
          </p>
        </div>
      ),
    },
    {
      question: "can i bulk generate qr codes?",
      category: "qr codes",
      tags: ["business-only", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! business and enterprise plans include bulk qr generation.
          </p>
          <p>
            select multiple links, choose a template style, and generate all qr codes at once. export as zip file.
          </p>
          <p>
            perfect for events, partner programs, or product packaging.
          </p>
        </div>
      ),
    },

    // ========== ANALYTICS & REPORTING ==========
    {
      question: "what analytics do i get?",
      category: "analytics & reporting",
      tags: ["beginner", "popular"],
      answer: (
        <div className="space-y-4">
          <p>
            utm.one provides comprehensive click analytics including:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>total clicks and unique visitors</li>
            <li>device breakdown (desktop, mobile, tablet)</li>
            <li>browser and os distribution</li>
            <li>geographic location (country, region, city)</li>
            <li>referrer sources</li>
            <li>campaign performance (utm-based rollups)</li>
            <li>time-series trends with forecasting</li>
            <li>conversion funnel tracking</li>
          </ul>
        </div>
      ),
    },
    {
      question: "how long is my data stored?",
      category: "analytics & reporting",
      tags: ["billing"],
      answer: (
        <div className="space-y-4">
          <p>
            data retention by plan:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>free:</strong> 90 days</li>
            <li><strong>pro:</strong> 1 year</li>
            <li><strong>business:</strong> 3 years</li>
            <li><strong>enterprise:</strong> unlimited</li>
          </ul>
          <p>
            you can export your data at any time in csv or xlsx format before it expires.
          </p>
        </div>
      ),
    },
    {
      question: "can i see where clicks come from?",
      category: "analytics & reporting",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! utm.one tracks:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>geographic location:</strong> country, region, city</li>
            <li><strong>referrer domain:</strong> which website sent the traffic</li>
            <li><strong>utm source/medium:</strong> campaign attribution</li>
          </ul>
          <p>
            all geolocation data is gdpr-compliant and anonymized after retention period.
          </p>
        </div>
      ),
    },
    {
      question: "what device information is tracked?",
      category: "analytics & reporting",
      tags: ["technical"],
      answer: (
        <div className="space-y-4">
          <p>
            utm.one detects and logs:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>device type (desktop, mobile, tablet)</li>
            <li>browser (chrome, firefox, safari, edge)</li>
            <li>operating system (windows, macos, ios, android, linux)</li>
            <li>screen resolution (bucketed for privacy)</li>
          </ul>
          <p>
            no personally identifiable information (pii) is stored.
          </p>
        </div>
      ),
    },
    {
      question: "can i export my analytics data?",
      category: "analytics & reporting",
      tags: ["popular"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! you can export analytics in csv or xlsx format.
          </p>
          <p>
            exports include:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>all click records with timestamps</li>
            <li>device/browser/os breakdown</li>
            <li>geographic data</li>
            <li>utm parameters</li>
            <li>conversion events</li>
          </ul>
          <p>
            perfect for custom analysis in excel, google sheets, or bi tools.
          </p>
        </div>
      ),
    },
    {
      question: "what's the best time to share my links?",
      category: "analytics & reporting",
      tags: ["new-feature", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            utm.one analyzes your click patterns and shows you when your audience is most active.
          </p>
          <p>
            the "timing insights" tab shows:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>click heatmap by hour and day</li>
            <li>best days of week to post</li>
            <li>optimal posting times</li>
          </ul>
          <p>
            this helps you schedule content when your audience is online and engaged.
          </p>
        </div>
      ),
    },
    {
      question: "how do i compare performance periods?",
      category: "analytics & reporting",
      tags: ["advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            the analytics "overview" tab includes period comparison.
          </p>
          <p>
            select "compare to previous period" or "compare to last year" to see:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>clicks change (↑ 23% vs last month)</li>
            <li>unique visitors change</li>
            <li>click-through rate trends</li>
          </ul>
          <p>
            perfect for monthly reports or yoy growth analysis.
          </p>
        </div>
      ),
    },
    {
      question: "what's the efficient frontier chart?",
      category: "analytics & reporting",
      tags: ["advanced", "new-feature"],
      answer: (
        <div className="space-y-4">
          <p>
            the efficient frontier is a pareto optimization chart showing which campaigns give you the best roi.
          </p>
          <p>
            campaigns on the gold line are optimal. campaigns below the line are underperforming and should be paused or optimized.
          </p>
          <p>
            this is based on algorithms from "algorithms for optimization" and helps you allocate budget efficiently.
          </p>
        </div>
      ),
    },
    {
      question: "can i see real-time clicks?",
      category: "analytics & reporting",
      tags: ["pro-only"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! pro and higher plans include real-time analytics with live click feed.
          </p>
          <p>
            see clicks as they happen, including:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>city/country of visitor</li>
            <li>device type</li>
            <li>referrer source</li>
          </ul>
          <p>
            perfect for monitoring campaign launches or event qr codes.
          </p>
        </div>
      ),
    },
    {
      question: "how accurate is geolocation data?",
      category: "analytics & reporting",
      tags: ["technical"],
      answer: (
        <div className="space-y-4">
          <p>
            geolocation accuracy depends on data source:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>country:</strong> 99%+ accurate</li>
            <li><strong>region/state:</strong> 90%+ accurate</li>
            <li><strong>city:</strong> 70-80% accurate (approximation)</li>
          </ul>
          <p>
            we use cloudflare's ip geolocation data, which is enterprise-grade and gdpr-compliant.
          </p>
        </div>
      ),
    },

    // ========== GEO-TARGETING ==========
    {
      question: "what is geo-targeting?",
      category: "geo-targeting",
      tags: ["pro-only", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            geo-targeting lets you redirect visitors to different urls based on their country.
          </p>
          <p>
            for example:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>us visitors → yoursite.com/us-pricing</li>
            <li>uk visitors → yoursite.com/uk-pricing</li>
            <li>everyone else → yoursite.com/global-pricing</li>
          </ul>
          <p>
            perfect for localized campaigns, regional pricing, or compliance requirements.
          </p>
        </div>
      ),
    },
    {
      question: "how do i redirect by country?",
      category: "geo-targeting",
      tags: ["pro-only", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            from the link detail page, go to "geo-targeting" tab and add rules:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>select country (searchable dropdown)</li>
            <li>enter destination url for that country</li>
            <li>repeat for other countries</li>
          </ul>
          <p>
            if no rule matches, visitors see the default destination url.
          </p>
        </div>
      ),
    },
    {
      question: "can i set multiple country rules?",
      category: "geo-targeting",
      tags: ["pro-only"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! you can add unlimited country rules per link.
          </p>
          <p>
            common patterns:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>us + uk + canada → english version</li>
            <li>france + belgium → french version</li>
            <li>everyone else → default version</li>
          </ul>
        </div>
      ),
    },
    {
      question: "what happens if no rule matches?",
      category: "geo-targeting",
      tags: ["pro-only"],
      answer: (
        <div className="space-y-4">
          <p>
            if a visitor's country doesn't match any rule, they're redirected to the default destination url (the original url you provided).
          </p>
          <p>
            this ensures no one sees a broken link.
          </p>
        </div>
      ),
    },
    {
      question: "is geo-targeting available on free plan?",
      category: "geo-targeting",
      tags: ["billing"],
      answer: (
        <div className="space-y-4">
          <p>
            no, geo-targeting requires pro plan ($20/month) or higher.
          </p>
          <p>
            free users can see geographic analytics but cannot redirect by country.
          </p>
        </div>
      ),
    },
    {
      question: "how accurate is country detection?",
      category: "geo-targeting",
      tags: ["technical", "pro-only"],
      answer: (
        <div className="space-y-4">
          <p>
            country detection is 99%+ accurate using cloudflare's cf-ipcountry header.
          </p>
          <p>
            vpn users may be detected as the vpn server's country, not their actual location.
          </p>
        </div>
      ),
    },

    // ========== A/B TESTING & SMART ROTATOR ==========
    {
      question: "what is a/b testing in utm.one?",
      category: "a/b testing & smart rotator",
      tags: ["business-only", "advanced", "new-feature"],
      answer: (
        <div className="space-y-4">
          <p>
            a/b testing lets you send traffic to multiple destination urls and measure which performs best.
          </p>
          <p>
            utm.one uses thompson sampling (a bayesian algorithm) to automatically shift traffic to the winning variant.
          </p>
          <p>
            available on business and enterprise plans.
          </p>
        </div>
      ),
    },
    {
      question: "how does the smart rotator work?",
      category: "a/b testing & smart rotator",
      tags: ["business-only", "advanced", "new-feature"],
      answer: (
        <div className="space-y-4">
          <p>
            the smart rotator uses machine learning to optimize traffic distribution:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>explore (10%):</strong> test all variants to gather data</li>
            <li><strong>exploit (90%):</strong> send most traffic to the best-performing url</li>
          </ul>
          <p>
            over time, the system learns which destination drives the most clicks, conversions, or engagement.
          </p>
        </div>
      ),
    },
    {
      question: "what is thompson sampling?",
      category: "a/b testing & smart rotator",
      tags: ["technical", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            thompson sampling is a bayesian optimization algorithm that balances exploration (testing all variants) with exploitation (sending traffic to the winner).
          </p>
          <p>
            it's faster than traditional a/b testing because it doesn't wait until the end—it shifts traffic to the winning variant in real-time.
          </p>
        </div>
      ),
    },
    {
      question: "how do i add multiple destinations?",
      category: "a/b testing & smart rotator",
      tags: ["business-only", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            from the link detail page, enable "smart rotator" and add destinations:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>variant a: landing-page-v1.com</li>
            <li>variant b: landing-page-v2.com</li>
            <li>variant c: landing-page-v3.com</li>
          </ul>
          <p>
            traffic is split automatically. winning variant receives more clicks over time.
          </p>
        </div>
      ),
    },
    {
      question: "how does traffic get split?",
      category: "a/b testing & smart rotator",
      tags: ["business-only", "technical"],
      answer: (
        <div className="space-y-4">
          <p>
            initially, traffic is split evenly (e.g., 33/33/33 for 3 variants).
          </p>
          <p>
            as data comes in, the smart rotator shifts traffic toward the best-performing variant using epsilon-greedy strategy:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>90% of traffic goes to current winner</li>
            <li>10% tests other variants (exploration)</li>
          </ul>
        </div>
      ),
    },
    {
      question: "can i manually set traffic weights?",
      category: "a/b testing & smart rotator",
      tags: ["business-only", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! you can override smart rotator and set manual traffic split:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>variant a: 50%</li>
            <li>variant b: 30%</li>
            <li>variant c: 20%</li>
          </ul>
          <p>
            this disables automatic optimization but gives you full control.
          </p>
        </div>
      ),
    },
    {
      question: "how do i know which variant is winning?",
      category: "a/b testing & smart rotator",
      tags: ["business-only", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            the link detail "analytics" tab shows performance by variant:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>clicks per variant</li>
            <li>click-through rate</li>
            <li>conversions (if tracking pixel installed)</li>
            <li>confidence interval (statistical significance)</li>
          </ul>
          <p>
            utm.one highlights the winning variant with a gold badge when statistically significant.
          </p>
        </div>
      ),
    },
    {
      question: "can i a/b test social previews?",
      category: "a/b testing & smart rotator",
      tags: ["business-only", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! each variant can have its own open graph metadata (title, description, image).
          </p>
          <p>
            when someone shares your link, the social preview reflects the variant they received.
          </p>
          <p>
            perfect for testing which headline or image gets more clicks on social media.
          </p>
        </div>
      ),
    },

    // ========== LINK HEALTH MONITOR ==========
    {
      question: "what is link health monitor?",
      category: "link health monitor",
      tags: ["new-feature", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            link health monitor automatically checks your destination urls to ensure they're working.
          </p>
          <p>
            it detects:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>404 errors (page not found)</li>
            <li>500 errors (server issues)</li>
            <li>slow load times</li>
            <li>ssl certificate problems</li>
          </ul>
          <p>
            you get alerts when links break, preventing wasted clicks on broken urls.
          </p>
        </div>
      ),
    },
    {
      question: "how does automatic health checking work?",
      category: "link health monitor",
      tags: ["advanced", "technical"],
      answer: (
        <div className="space-y-4">
          <p>
            utm.one checks your top 100 most-clicked links every hour.
          </p>
          <p>
            if a link becomes unhealthy:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>status changes to "unhealthy" in dashboard</li>
            <li>email alert sent to workspace admins</li>
            <li>optional: traffic routed to fallback url</li>
          </ul>
          <p>
            less-popular links are checked weekly.
          </p>
        </div>
      ),
    },
    {
      question: "what is a fallback url?",
      category: "link health monitor",
      tags: ["advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            a fallback url is a backup destination that visitors see if the primary url is broken.
          </p>
          <p>
            for example:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>primary url: yoursite.com/special-offer (broken)</li>
            <li>fallback url: yoursite.com/homepage (working)</li>
          </ul>
          <p>
            this prevents users from seeing 404 errors when links break.
          </p>
        </div>
      ),
    },
    {
      question: "how often are links checked?",
      category: "link health monitor",
      tags: ["technical"],
      answer: (
        <div className="space-y-4">
          <p>
            check frequency by link popularity:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>top 100 links:</strong> every hour</li>
            <li><strong>active links:</strong> daily</li>
            <li><strong>low-traffic links:</strong> weekly</li>
          </ul>
          <p>
            enterprise plans can request custom check intervals.
          </p>
        </div>
      ),
    },
    {
      question: "what happens when a link becomes unhealthy?",
      category: "link health monitor",
      tags: ["advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            when a link fails health checks:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>dashboard shows red "unhealthy" badge</li>
            <li>email alert sent to workspace admins</li>
            <li>optional: slack notification via integration</li>
            <li>if fallback url configured, traffic routed there</li>
          </ul>
          <p>
            once fixed, status automatically returns to "healthy" on next check.
          </p>
        </div>
      ),
    },
    {
      question: "can i manually run a health check?",
      category: "link health monitor",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            yes! from the link detail page, click "check health now" to run an immediate scan.
          </p>
          <p>
            useful after fixing a broken url or deploying new landing pages.
          </p>
        </div>
      ),
    },

    // ========== TRACKING PIXEL & CONVERSIONS ==========
    {
      question: "what is the tracking pixel?",
      category: "tracking pixel & conversions",
      tags: ["beginner", "popular", "technical"],
      answer: (
        <div className="space-y-4">
          <p>
            the tracking pixel is a small javascript snippet you paste into your website's &lt;head&gt; tag.
          </p>
          <p>
            it connects clicks to conversions (leads, purchases, signups) so you can see full-funnel attribution and roi.
          </p>
          <p className="text-amber-600 dark:text-amber-400 font-medium">
            ⚠️ without the pixel, you'll only see clicks—not what happens after the click.
          </p>
        </div>
      ),
    },
    {
      question: "how do i install the tracking pixel?",
      category: "tracking pixel & conversions",
      tags: ["beginner", "technical"],
      answer: (
        <div className="space-y-4">
          <p>
            from settings → tracking pixel, copy the javascript snippet and paste it in your website's &lt;head&gt; section:
          </p>
          <pre className="bg-muted/20 p-4 rounded-lg text-sm overflow-x-auto">
{`<script>
(function() {
  window.utmone = function(event, data) {
    // tracking code
  };
})();
</script>`}
          </pre>
          <p>
            works with any website builder (wordpress, webflow, shopify, etc.).
          </p>
        </div>
      ),
    },
    {
      question: "what events can i track?",
      category: "tracking pixel & conversions",
      tags: ["advanced", "technical"],
      answer: (
        <div className="space-y-4">
          <p>
            you can track any custom event:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>lead:</strong> form submissions, email signups</li>
            <li><strong>purchase:</strong> completed transactions with revenue</li>
            <li><strong>signup:</strong> account creations</li>
            <li><strong>custom:</strong> any action you define</li>
          </ul>
          <p>
            example: <code>utmone('track', 'purchase', {"{revenue: 99.00}"});</code>
          </p>
        </div>
      ),
    },
    {
      question: "can i track revenue?",
      category: "tracking pixel & conversions",
      tags: ["advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! pass revenue value with your purchase events:
          </p>
          <pre className="bg-muted/20 p-4 rounded-lg text-sm overflow-x-auto">
{`utmone('track', 'purchase', {
  revenue: 149.99,
  currency: 'USD'
});`}
          </pre>
          <p>
            utm.one will show total revenue attributed to each link, campaign, and utm source.
          </p>
        </div>
      ),
    },
    {
      question: "what is the conversion funnel?",
      category: "tracking pixel & conversions",
      tags: ["advanced", "popular"],
      answer: (
        <div className="space-y-4">
          <p>
            the conversion funnel shows your full customer journey:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>clicks:</strong> initial link visits</li>
            <li><strong>leads:</strong> users who submitted a form</li>
            <li><strong>purchases:</strong> completed transactions</li>
          </ul>
          <p>
            you'll see drop-off rates at each stage and identify where users are leaving.
          </p>
        </div>
      ),
    },
    {
      question: "do i need the pixel for click tracking?",
      category: "tracking pixel & conversions",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            no! click tracking works automatically without the pixel.
          </p>
          <p>
            the pixel is only required to track conversions (what happens after the click).
          </p>
          <p>
            if you only care about clicks/devices/geography, you don't need the pixel.
          </p>
        </div>
      ),
    },
    {
      question: "what's the domain whitelist for?",
      category: "tracking pixel & conversions",
      tags: ["technical", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            the domain whitelist controls which websites can send conversion events to your workspace.
          </p>
          <p>
            this prevents unauthorized sites from spamming your analytics with fake conversions.
          </p>
          <p>
            add all domains where you've installed the pixel (e.g., yoursite.com, app.yoursite.com).
          </p>
        </div>
      ),
    },
    {
      question: "is the pixel gdpr compliant?",
      category: "tracking pixel & conversions",
      tags: ["technical", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! the pixel:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>doesn't collect pii without consent</li>
            <li>uses first-party cookies (not third-party)</li>
            <li>respects do not track signals</li>
            <li>allows opt-out via cookie banner</li>
          </ul>
          <p>
            you're responsible for adding cookie consent banners to your website.
          </p>
        </div>
      ),
    },

    // ========== CUSTOM DOMAINS ==========
    {
      question: "how do i add a custom domain?",
      category: "custom domains",
      tags: ["popular", "technical"],
      answer: (
        <div className="space-y-4">
          <p>
            from settings → domains, click "add domain" and enter your domain (e.g., go.yourcompany.com).
          </p>
          <p>
            you'll need to add two dns records:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>txt record:</strong> for ownership verification (_utm-verification)</li>
            <li><strong>cname record:</strong> to route traffic (points to go.utm.one)</li>
          </ul>
          <p>
            full instructions with registrar-specific guides are shown in the dashboard.
          </p>
        </div>
      ),
    },
    {
      question: "what dns records do i need?",
      category: "custom domains",
      tags: ["technical"],
      answer: (
        <div className="space-y-4">
          <p>
            you need two separate dns configurations:
          </p>
          <p>
            <strong>1. txt record (verification):</strong>
          </p>
          <pre className="bg-muted/20 p-4 rounded-lg text-sm overflow-x-auto">
{`Name: _utm-verification
Value: utm-verify-abc123xyz`}
          </pre>
          <p>
            <strong>2. cname record (routing):</strong>
          </p>
          <pre className="bg-muted/20 p-4 rounded-lg text-sm overflow-x-auto">
{`Name: go (for go.yourcompany.com)
Value: go.utm.one`}
          </pre>
        </div>
      ),
    },
    {
      question: "how long does domain verification take?",
      category: "custom domains",
      tags: ["technical"],
      answer: (
        <div className="space-y-4">
          <p>
            dns propagation typically takes:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>5-10 minutes:</strong> for cloudflare, route53</li>
            <li><strong>30-60 minutes:</strong> for godaddy, namecheap</li>
            <li><strong>up to 24 hours:</strong> worst case</li>
          </ul>
          <p>
            once verified, ssl certificates are issued automatically within minutes.
          </p>
        </div>
      ),
    },
    {
      question: "can i use my root domain?",
      category: "custom domains",
      tags: ["technical", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes, but root domains (yourcompany.com) require special dns setup.
          </p>
          <p>
            most registrars need:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>cloudflare:</strong> use cloudflare nameservers + cname flattening</li>
            <li><strong>godaddy/namecheap:</strong> use alias or aname record</li>
            <li><strong>route53:</strong> use alias record</li>
          </ul>
          <p>
            we provide registrar-specific guides in the dashboard.
          </p>
        </div>
      ),
    },
    {
      question: "what's the difference between cname and a records?",
      category: "custom domains",
      tags: ["technical"],
      answer: (
        <div className="space-y-4">
          <ul className="list-disc list-inside space-y-2">
            <li><strong>cname:</strong> points subdomain to another domain (go.yourcompany.com → go.utm.one)</li>
            <li><strong>a record:</strong> points domain to ip address (yourcompany.com → 1.2.3.4)</li>
          </ul>
          <p>
            for utm.one, always use cname for subdomains. root domains need alias/aname (which act like cname).
          </p>
        </div>
      ),
    },
    {
      question: "how many custom domains can i have?",
      category: "custom domains",
      tags: ["billing"],
      answer: (
        <div className="space-y-4">
          <p>
            domains by plan:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>free:</strong> 0 custom domains</li>
            <li><strong>pro:</strong> 1 custom domain</li>
            <li><strong>business:</strong> 5 custom domains</li>
            <li><strong>enterprise:</strong> unlimited</li>
          </ul>
          <p>
            you can use utm.one or utm.click subdomains on all plans.
          </p>
        </div>
      ),
    },
    {
      question: "can i use a subdomain?",
      category: "custom domains",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! subdomains are recommended (e.g., go.yourcompany.com, links.yourcompany.com).
          </p>
          <p>
            they're easier to set up than root domains and don't affect your main website.
          </p>
        </div>
      ),
    },
    {
      question: "what if domain verification fails?",
      category: "custom domains",
      tags: ["troubleshooting", "technical"],
      answer: (
        <div className="space-y-4">
          <p>
            common issues:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>nxdomain error:</strong> dns records not found. check that you added both txt and cname records.</li>
            <li><strong>value mismatch:</strong> wrong verification code. copy the exact value from utm.one.</li>
            <li><strong>propagation delay:</strong> wait 30-60 minutes and try again.</li>
          </ul>
          <p>
            use dns checkers like dnschecker.org to verify your records are live.
          </p>
        </div>
      ),
    },

    // ========== TEAMS & WORKSPACES ==========
    {
      question: "how do i invite team members?",
      category: "teams & workspaces",
      tags: ["popular", "beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            from settings → team, click "invite member" and enter their email address.
          </p>
          <p>
            select a role (admin, editor, viewer) and send the invite. they'll receive an email with a signup link.
          </p>
          <p>
            invitations expire after 7 days.
          </p>
        </div>
      ),
    },
    {
      question: "what roles are available?",
      category: "teams & workspaces",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <ul className="list-disc list-inside space-y-2">
            <li><strong>owner:</strong> full access (workspace settings, billing, delete workspace)</li>
            <li><strong>admin:</strong> manage team, links, domains, integrations</li>
            <li><strong>editor:</strong> create and edit links, generate qr codes</li>
            <li><strong>viewer:</strong> view-only access to links and analytics</li>
          </ul>
        </div>
      ),
    },
    {
      question: "what can each role do?",
      category: "teams & workspaces",
      tags: ["advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            <strong>owner/admin:</strong> everything (create links, invite users, manage billing, configure domains)
          </p>
          <p>
            <strong>editor:</strong> create, edit, delete links and qr codes. view analytics.
          </p>
          <p>
            <strong>viewer:</strong> view links, analytics, and reports. cannot create or edit.
          </p>
        </div>
      ),
    },
    {
      question: "how do i remove a team member?",
      category: "teams & workspaces",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            from settings → team, find the member and click "remove."
          </p>
          <p>
            they'll lose access immediately. their created links remain in the workspace.
          </p>
        </div>
      ),
    },
    {
      question: "can i have multiple workspaces?",
      category: "teams & workspaces",
      tags: ["advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! each workspace is a separate team with its own:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>links and analytics</li>
            <li>custom domains</li>
            <li>team members</li>
            <li>billing (paid plans)</li>
          </ul>
          <p>
            switch workspaces from the dropdown in the top navigation.
          </p>
        </div>
      ),
    },
    {
      question: "is there a limit on team members?",
      category: "teams & workspaces",
      tags: ["billing"],
      answer: (
        <div className="space-y-4">
          <p>
            no! all paid plans include unlimited team members with no per-seat charges.
          </p>
          <p>
            free plan supports up to 3 team members.
          </p>
        </div>
      ),
    },
    {
      question: "what is the smart contact ranking?",
      category: "teams & workspaces",
      tags: ["new-feature", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            smart contact ranking analyzes your team's activity and suggests the best person to assign new links to.
          </p>
          <p>
            based on:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>historical assignment patterns</li>
            <li>campaign expertise (who handles email vs paid ads)</li>
            <li>workload balance</li>
          </ul>
          <p>
            saves time when delegating link creation.
          </p>
        </div>
      ),
    },
    {
      question: "how does the role recommender work?",
      category: "teams & workspaces",
      tags: ["new-feature", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            when inviting a team member, utm.one suggests their role based on:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>email domain (marketing@, sales@, ops@)</li>
            <li>historical role patterns in your workspace</li>
            <li>similar team structures</li>
          </ul>
          <p>
            you can override the suggestion before sending the invite.
          </p>
        </div>
      ),
    },

    // ========== PRICING & BILLING ==========
    {
      question: "how much does utm.one cost?",
      category: "pricing & billing",
      tags: ["popular", "beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            we offer four plans:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>free:</strong> 100 links, 10k clicks/month, 90-day analytics</li>
            <li><strong>pro ($20/month):</strong> 1,000 links, 1 custom domain, 100k clicks/month, 1-year analytics</li>
            <li><strong>business ($99/month):</strong> 10k links, 5 custom domains, unlimited clicks, 3-year analytics, advanced features</li>
            <li><strong>enterprise ($300/month):</strong> unlimited everything, sso, sla, dedicated support</li>
          </ul>
          <Link to="/pricing" className="text-primary hover:underline font-medium">
            view detailed pricing →
          </Link>
        </div>
      ),
    },
    {
      question: "what's included in each plan?",
      category: "pricing & billing",
      tags: ["popular"],
      answer: (
        <div className="space-y-4">
          <p>
            all plans include:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>unlimited team members (no per-seat pricing)</li>
            <li>unlimited qr code generation</li>
            <li>analytics and reporting</li>
            <li>tracking pixel</li>
          </ul>
          <p>
            paid plans unlock: custom domains, geo-targeting, a/b testing, smart rotator, advanced analytics, longer data retention.
          </p>
        </div>
      ),
    },
    {
      question: "can i try before i buy?",
      category: "pricing & billing",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! the free plan has no credit card required and no time limit.
          </p>
          <p>
            you can test all core features (link shortening, qr codes, analytics) before upgrading to paid plans.
          </p>
        </div>
      ),
    },
    {
      question: "how do i upgrade my plan?",
      category: "pricing & billing",
      tags: ["popular"],
      answer: (
        <div className="space-y-4">
          <p>
            from settings → billing, click "upgrade plan" and select your tier.
          </p>
          <p>
            you'll be charged immediately (prorated for current month) and new limits apply instantly.
          </p>
          <p>
            all existing links remain active during upgrade.
          </p>
        </div>
      ),
    },
    {
      question: "what happens when i hit my limits?",
      category: "pricing & billing",
      tags: ["popular"],
      answer: (
        <div className="space-y-4">
          <p>
            when you reach your plan limits:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>links:</strong> you'll see a polite upgrade prompt. existing links keep working.</li>
            <li><strong>clicks:</strong> links continue working, but analytics freeze until next billing cycle.</li>
            <li><strong>domains:</strong> additional domains won't verify until you upgrade.</li>
          </ul>
          <p>
            we never break your links or hold data hostage.
          </p>
        </div>
      ),
    },
    {
      question: "can i downgrade my plan?",
      category: "pricing & billing",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            yes! from settings → billing, select a lower-tier plan.
          </p>
          <p>
            downgrade takes effect at the end of your current billing period. you'll retain paid features until then.
          </p>
          <p>
            if you exceed new limits (e.g., have 3 domains but downgrade to 1-domain plan), extra domains will be deactivated.
          </p>
        </div>
      ),
    },
    {
      question: "how do i cancel my subscription?",
      category: "pricing & billing",
      tags: ["popular"],
      answer: (
        <div className="space-y-4">
          <p>
            from settings → billing, click "cancel subscription."
          </p>
          <p>
            your subscription remains active until the end of your billing period. after that, you'll revert to the free plan.
          </p>
          <p>
            your links continue working, but you'll lose access to paid features and extended analytics.
          </p>
        </div>
      ),
    },
    {
      question: "is there a lifetime deal?",
      category: "pricing & billing",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            we occasionally offer lifetime deals for early adopters during product launches.
          </p>
          <p>
            join our waitlist or follow us on twitter for announcements.
          </p>
        </div>
      ),
    },

    // ========== SECURITY & PRIVACY ==========
    {
      question: "is my data secure?",
      category: "security & privacy",
      tags: ["popular", "technical"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! utm.one implements enterprise-grade security:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>field-level aes-256 encryption for sensitive data (api keys, tokens)</li>
            <li>row-level security (rls) policies on all database tables</li>
            <li>https-only with ssl/tls encryption</li>
            <li>soc 2 type ii compliance (enterprise plan)</li>
          </ul>
        </div>
      ),
    },
    {
      question: "is utm.one gdpr compliant?",
      category: "security & privacy",
      tags: ["technical", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! utm.one is fully gdpr-compliant:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>no pii collected without consent</li>
            <li>granular ip/geolocation data retention (configurable)</li>
            <li>data export and deletion on request</li>
            <li>dpa available for enterprise customers</li>
          </ul>
          <Link to="/legal/data-and-security" className="text-primary hover:underline font-medium">
            view data & security policy →
          </Link>
        </div>
      ),
    },
    {
      question: "what data do you collect?",
      category: "security & privacy",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            utm.one collects:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>click metadata (timestamp, ip, user agent, referrer)</li>
            <li>device/browser/os information</li>
            <li>geolocation (country, region, city)</li>
            <li>utm parameters and conversion events</li>
          </ul>
          <p>
            no pii is stored unless you explicitly configure it (e.g., user identifiers in conversion tracking).
          </p>
        </div>
      ),
    },
    {
      question: "can i delete my data?",
      category: "security & privacy",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            yes! from settings → account, click "delete workspace" to permanently remove all data:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>all links and analytics</li>
            <li>team members and invitations</li>
            <li>custom domains</li>
            <li>conversion events</li>
          </ul>
          <p className="text-amber-600 dark:text-amber-400 font-medium">
            ⚠️ deletion is permanent and cannot be undone.
          </p>
        </div>
      ),
    },
    {
      question: "what is field-level encryption?",
      category: "security & privacy",
      tags: ["technical", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            utm.one encrypts sensitive data (api keys, oauth tokens, webhook secrets) using aes-256 encryption before storing in the database.
          </p>
          <p>
            even if the database is compromised, attackers only see encrypted ciphertext—not usable credentials.
          </p>
          <p>
            encryption keys are stored separately in edge function environment variables.
          </p>
        </div>
      ),
    },
    {
      question: "how do you prevent fraud?",
      category: "security & privacy",
      tags: ["technical", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            utm.one includes fraud detection:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>bot detection via user agent analysis</li>
            <li>rate limiting on api endpoints</li>
            <li>duplicate click filtering (ip + user agent heuristics)</li>
            <li>suspicious activity alerts</li>
          </ul>
          <p>
            enterprise plans include advanced fraud scoring with machine learning.
          </p>
        </div>
      ),
    },

    // ========== DARK MODE & ACCESSIBILITY ==========
    {
      question: "how do i enable dark mode?",
      category: "dark mode & accessibility",
      tags: ["beginner", "popular"],
      answer: (
        <div className="space-y-4">
          <p>
            click the sun/moon icon in the top navigation to toggle dark mode.
          </p>
          <p>
            or select "auto" to match your system theme (light during day, dark at night).
          </p>
          <p>
            dark mode follows apple human interface guidelines with no pure black (#1c1c1e background).
          </p>
        </div>
      ),
    },
    {
      question: "can i set auto theme?",
      category: "dark mode & accessibility",
      tags: ["beginner"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! click the theme toggle and select "auto" to sync with your system theme.
          </p>
          <p>
            utm.one will automatically switch between light and dark mode based on your os settings.
          </p>
        </div>
      ),
    },
    {
      question: "is utm.one screen reader accessible?",
      category: "dark mode & accessibility",
      tags: ["technical", "advanced"],
      answer: (
        <div className="space-y-4">
          <p>
            yes! utm.one is wcag aaa compliant with:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>aria labels on all interactive elements</li>
            <li>semantic html throughout</li>
            <li>keyboard navigation support</li>
            <li>screen reader-friendly descriptions</li>
          </ul>
          <p>
            tested with nvda, jaws, and voiceover.
          </p>
        </div>
      ),
    },
    {
      question: "what accessibility features exist?",
      category: "dark mode & accessibility",
      tags: ["advanced"],
      answer: (
        <div className="space-y-4">
          <ul className="list-disc list-inside space-y-2">
            <li>high-contrast text (4.5:1 minimum ratio)</li>
            <li>focus indicators on all interactive elements</li>
            <li>skip-to-content link for keyboard users</li>
            <li>no reliance on color alone for meaning</li>
            <li>responsive text scaling up to 200%</li>
          </ul>
          <p>
            utm.one meets wcag aaa standards—among the highest accessibility compliance in the industry.
          </p>
        </div>
      ),
    },

    // ========== TROUBLESHOOTING ==========
    {
      question: "my link isn't redirecting, what do i do?",
      category: "troubleshooting",
      tags: ["popular"],
      answer: (
        <div className="space-y-4">
          <p>
            check these common issues:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>is the link paused or archived? (check status in dashboard)</li>
            <li>did the link hit its click limit?</li>
            <li>is the destination url correct and accessible?</li>
            <li>custom domain: are dns records configured correctly?</li>
          </ul>
          <p>
            if none of these apply, contact support with the short url.
          </p>
        </div>
      ),
    },
    {
      question: "why are my analytics not showing?",
      category: "troubleshooting",
      tags: ["popular"],
      answer: (
        <div className="space-y-4">
          <p>
            analytics may be delayed for a few reasons:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>no clicks yet (analytics only appear after first click)</li>
            <li>processing delay (analytics update every 5 minutes)</li>
            <li>plan limit reached (free plan caps at 10k clicks/month)</li>
          </ul>
          <p>
            try refreshing the page or checking back in a few minutes.
          </p>
        </div>
      ),
    },
    {
      question: "domain verification is stuck, help!",
      category: "troubleshooting",
      tags: ["technical"],
      answer: (
        <div className="space-y-4">
          <p>
            if domain verification is taking longer than 1 hour:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>verify both txt and cname records are added correctly</li>
            <li>use dns checker (dnschecker.org) to confirm records are live</li>
            <li>wait 30-60 minutes for propagation</li>
            <li>try clicking "verify again" in utm.one dashboard</li>
          </ul>
          <p>
            if still stuck after 24 hours, contact support.
          </p>
        </div>
      ),
    },
    {
      question: "why can't i see my team's links?",
      category: "troubleshooting",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            check your workspace and role:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>are you in the correct workspace? (check workspace dropdown)</li>
            <li>does your role allow viewing all links? (viewers see all, editors see own + assigned)</li>
            <li>are the links archived? (check "show archived" filter)</li>
          </ul>
          <p>
            admins can see all links in the workspace.
          </p>
        </div>
      ),
    },
    {
      question: "my qr code isn't scanning",
      category: "troubleshooting",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            qr scanning issues are usually:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>low resolution (regenerate at higher resolution)</li>
            <li>insufficient contrast (use darker foreground, lighter background)</li>
            <li>logo too large (covers too much of the qr code)</li>
            <li>printed too small (minimum 2cm x 2cm for most scanners)</li>
          </ul>
          <p>
            test with multiple qr scanner apps. if still failing, regenerate without logo.
          </p>
        </div>
      ),
    },
    {
      question: "how do i report a bug?",
      category: "troubleshooting",
      tags: [],
      answer: (
        <div className="space-y-4">
          <p>
            report bugs via:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>feedback widget (? icon in dashboard)</li>
            <li>email: support@utm.one</li>
            <li>discord community</li>
          </ul>
          <p>
            include: what you were trying to do, what happened, browser/os, screenshots if possible.
          </p>
          <p>
            we typically respond within 24 hours (pro/business within 4 hours).
          </p>
        </div>
      ),
    },
  ];

  // Get unique categories
  const categories = Array.from(new Set(allFAQs.map(faq => faq.category)));

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    return allFAQs.filter(faq => {
      const matchesSearch = searchQuery === "" || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === null || faq.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allFAQs]);

  // Group FAQs by category
  const faqsByCategory = useMemo(() => {
    const grouped: Record<string, FAQItem[]> = {};
    filteredFAQs.forEach(faq => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = [];
      }
      grouped[faq.category].push(faq);
    });
    return grouped;
  }, [filteredFAQs]);

  // Schema data for SEO
  const schemaFAQs = allFAQs.map(faq => ({
    question: faq.question,
    answer: typeof faq.answer === 'string' ? faq.answer : ''
  }));

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="FAQ - Frequently Asked Questions"
        description="comprehensive answers to all your utm.one questions: getting started, links, utms, qr codes, analytics, geo-targeting, a/b testing, tracking pixel, custom domains, teams, pricing, security, and more."
        canonical="https://utm.one/faq"
        keywords={['utm.one faq', 'link shortener questions', 'utm help', 'qr code faq', 'analytics questions', 'geo-targeting', 'a/b testing', 'tracking pixel']}
      />
      <FAQSchema questions={schemaFAQs} />
      <Navigation />
      <FloatingNavigation />

      {/* Hero with Search */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
              frequently asked questions
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              comprehensive answers to all your utm.one questions.
            </p>
          </div>

          <FAQSearchFilter
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            selectedCategory={selectedCategory}
            categories={categories}
            resultCount={filteredFAQs.length}
          />
        </div>
      </section>

      {/* FAQ Content by Category */}
      <div className="max-w-4xl mx-auto px-8 py-16 space-y-16">
        {Object.keys(faqsByCategory).length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              no results found for "{searchQuery}"
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="mt-6"
            >
              clear search
            </Button>
          </div>
        ) : (
          Object.entries(faqsByCategory).map(([category, faqs]) => (
            <section key={category}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {category}
                </h2>
                <Badge variant="secondary" className="text-sm">
                  {faqs.length}
                </Badge>
              </div>
              <FAQAccordion 
                items={faqs.map(faq => ({
                  question: faq.question,
                  answer: (
                    <div className="space-y-4">
                      {faq.answer}
                      {faq.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4">
                          {faq.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                }))} 
              />
            </section>
          ))
        )}

        {/* Still Need Help */}
        <section className="border-t border-border pt-16">
          <div className="bg-muted/20 border border-border rounded-2xl p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              still need help?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              can't find what you're looking for? our support team is here to help.
            </p>
            <Link
              to="/support"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              contact support
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
