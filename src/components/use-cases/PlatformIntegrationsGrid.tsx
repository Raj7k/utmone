import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Platform {
  name: string;
  logo?: string;
  category?: string;
}

interface PlatformIntegrationsGridProps {
  title: string;
  subtitle?: string;
  platforms: Platform[];
}

// Platform data with consistent styling
const platformLogos: Record<string, { bg: string; text: string }> = {
  "Shopify": { bg: "bg-[#96BF47]/10", text: "text-[#96BF47]" },
  "WooCommerce": { bg: "bg-[#96588A]/10", text: "text-[#96588A]" },
  "BigCommerce": { bg: "bg-[#121118]/10", text: "text-foreground" },
  "Magento": { bg: "bg-[#F26322]/10", text: "text-[#F26322]" },
  "Salesforce": { bg: "bg-[#00A1E0]/10", text: "text-[#00A1E0]" },
  "HubSpot": { bg: "bg-[#FF7A59]/10", text: "text-[#FF7A59]" },
  "Pipedrive": { bg: "bg-[#1D1D1B]/10", text: "text-foreground" },
  "Close": { bg: "bg-[#2C2C2C]/10", text: "text-foreground" },
  "Instagram": { bg: "bg-gradient-to-br from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10", text: "text-[#E1306C]" },
  "TikTok": { bg: "bg-[#010101]/10", text: "text-foreground" },
  "YouTube": { bg: "bg-[#FF0000]/10", text: "text-[#FF0000]" },
  "Facebook": { bg: "bg-[#1877F2]/10", text: "text-[#1877F2]" },
  "Google Ads": { bg: "bg-[#4285F4]/10", text: "text-[#4285F4]" },
  "LinkedIn": { bg: "bg-[#0A66C2]/10", text: "text-[#0A66C2]" },
  "Stripe": { bg: "bg-[#635BFF]/10", text: "text-[#635BFF]" },
  "Klaviyo": { bg: "bg-[#000000]/10", text: "text-foreground" },
  "Mailchimp": { bg: "bg-[#FFE01B]/10", text: "text-[#FFE01B]" },
  "Notion": { bg: "bg-[#000000]/10", text: "text-foreground" },
  "Slack": { bg: "bg-[#4A154B]/10", text: "text-[#4A154B]" },
  "Zapier": { bg: "bg-[#FF4F00]/10", text: "text-[#FF4F00]" },
  "Segment": { bg: "bg-[#52BD94]/10", text: "text-[#52BD94]" },
  "Google Analytics": { bg: "bg-[#E37400]/10", text: "text-[#E37400]" },
  "Mixpanel": { bg: "bg-[#7856FF]/10", text: "text-[#7856FF]" },
  "Amplitude": { bg: "bg-[#1E61F0]/10", text: "text-[#1E61F0]" },
};

export const PlatformIntegrationsGrid = ({
  title,
  subtitle,
  platforms,
}: PlatformIntegrationsGridProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="max-w-[980px] mx-auto px-6 md:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platforms.map((platform, index) => {
            const colors = platformLogos[platform.name] || { bg: "bg-muted", text: "text-foreground" };
            
            return (
              <motion.div
                key={platform.name}
                className={`
                  p-6 rounded-2xl border border-border bg-card
                  hover:border-primary/30 hover:shadow-lg transition-all duration-300
                  flex flex-col items-center justify-center gap-3 cursor-pointer group
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                  <span className={`text-lg font-bold ${colors.text}`}>
                    {platform.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {platform.name}
                </span>
                {platform.category && (
                  <span className="text-xs text-muted-foreground">{platform.category}</span>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.p 
          className="text-center text-sm text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          works with your existing stack. no code changes required.
        </motion.p>
      </div>
    </section>
  );
};

// Pre-configured platform grids

export const EcommercePlatforms = () => (
  <PlatformIntegrationsGrid
    title="works with your commerce stack"
    subtitle="connect utm.one to your existing ecommerce platform in minutes"
    platforms={[
      { name: "Shopify" },
      { name: "WooCommerce" },
      { name: "BigCommerce" },
      { name: "Magento" },
      { name: "Stripe" },
      { name: "Klaviyo" },
      { name: "Google Analytics" },
      { name: "Facebook" },
    ]}
  />
);

export const SaaSPlatforms = () => (
  <PlatformIntegrationsGrid
    title="integrates with your CRM"
    subtitle="sync attribution data directly to your sales and marketing tools"
    platforms={[
      { name: "Salesforce" },
      { name: "HubSpot" },
      { name: "Pipedrive" },
      { name: "Close" },
      { name: "Segment" },
      { name: "Mixpanel" },
      { name: "Amplitude" },
      { name: "Slack" },
    ]}
  />
);

export const InfluencerPlatforms = () => (
  <PlatformIntegrationsGrid
    title="track across every platform"
    subtitle="unified attribution for all your creator partnerships"
    platforms={[
      { name: "Instagram" },
      { name: "TikTok" },
      { name: "YouTube" },
      { name: "Facebook" },
      { name: "LinkedIn" },
      { name: "Google Analytics" },
      { name: "Shopify" },
      { name: "Stripe" },
    ]}
  />
);

export const AgencyPlatforms = () => (
  <PlatformIntegrationsGrid
    title="works with every client's stack"
    subtitle="manage diverse client tech stacks from one platform"
    platforms={[
      { name: "Google Ads" },
      { name: "Facebook" },
      { name: "Google Analytics" },
      { name: "HubSpot" },
      { name: "Salesforce" },
      { name: "Shopify" },
      { name: "Notion" },
      { name: "Slack" },
    ]}
  />
);
