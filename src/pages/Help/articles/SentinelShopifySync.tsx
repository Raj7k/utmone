import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";

const SentinelShopifySync = () => (
  <HelpArticleLayout
    title="Shopify inventory sync"
    description="Connect Shopify to automatically route away from out-of-stock product links."
    breadcrumbs={[
      { label: "Sentinel Mode", href: "/help/sentinel" },
      { label: "Shopify Sync" }
    ]}
  >
    <h2>What it is</h2>
    <p>
      Shopify sync connects utm.one to your Shopify store's inventory data. When a product 
      goes out of stock, links to that product automatically route to an alternative 
      destination—preventing frustrated customers from landing on "sold out" pages.
    </p>

    <h2>Why it matters</h2>
    <p>
      Out-of-stock experiences kill conversions:
    </p>
    <ul>
      <li>Visitors clicking ads for unavailable products bounce immediately</li>
      <li>QR codes on packaging continue driving traffic to sold-out items</li>
      <li>Email campaigns with product links become useless mid-campaign</li>
      <li>Every OOS page view wastes marketing budget and damages trust</li>
    </ul>

    <h2>How it works</h2>

    <h3>1. Connect your store</h3>
    <p>
      Link your Shopify store to utm.one through our secure OAuth integration. We only 
      request read access to product and inventory data—never order or customer information.
    </p>

    <h3>2. Automatic product matching</h3>
    <p>
      utm.one analyzes your link destinations and automatically identifies which links 
      point to Shopify product pages. No manual tagging required.
    </p>

    <h3>3. Real-time inventory monitoring</h3>
    <p>
      We sync with Shopify every few minutes to track inventory levels. When a product's 
      stock drops to zero, we mark it for routing.
    </p>

    <h3>4. Intelligent routing</h3>
    <p>
      Out-of-stock links automatically redirect to your configured alternative:
    </p>
    <ul>
      <li><strong>Category page:</strong> Show similar products in the same category</li>
      <li><strong>Similar product:</strong> Route to a specific alternative item</li>
      <li><strong>Waitlist page:</strong> Capture email for back-in-stock notifications</li>
      <li><strong>Custom page:</strong> Any URL you specify</li>
    </ul>

    <h2>Setting up Shopify sync</h2>
    <ol>
      <li>Go to <strong>Settings → Integrations → Shopify</strong></li>
      <li>Click <strong>Connect Shopify Store</strong></li>
      <li>Authorize utm.one in the Shopify popup</li>
      <li>Configure default out-of-stock routing</li>
      <li>Enable Shopify sync on relevant links</li>
    </ol>

    <h2>Routing options</h2>

    <h3>Global fallback</h3>
    <p>
      Set a default destination for all out-of-stock products. Best for stores with 
      many similar items where any alternative works.
    </p>

    <h3>Category-based routing</h3>
    <p>
      Route to the product's collection page automatically. Visitors see related 
      products instead of a dead end.
    </p>

    <h3>Product-specific alternatives</h3>
    <p>
      For high-value products, specify exact alternatives. If the red sneaker is 
      sold out, route to the blue version.
    </p>

    <h2>Low stock alerts</h2>
    <p>
      Optionally enable alerts when inventory drops below a threshold:
    </p>
    <ul>
      <li>Get notified before products go out of stock</li>
      <li>Proactively pause or redirect high-traffic links</li>
      <li>Coordinate with inventory team to restock fast-moving items</li>
    </ul>

    <h2>Back-in-stock recovery</h2>
    <p>
      When inventory is replenished, utm.one can:
    </p>
    <ul>
      <li><strong>Auto-restore:</strong> Immediately route back to the original product</li>
      <li><strong>Manual restore:</strong> Wait for your confirmation before switching</li>
      <li><strong>Notify you:</strong> Send an alert so you can decide</li>
    </ul>

    <h2>Multi-variant handling</h2>
    <p>
      If a product has variants (sizes, colors), you can configure:
    </p>
    <ul>
      <li><strong>Any variant available:</strong> Only route when ALL variants are out</li>
      <li><strong>Specific variant:</strong> Track only the variant in your link</li>
    </ul>

    <h2>Pro tips</h2>
    <ul>
      <li>Set up category-based routing as default—it's the most useful fallback</li>
      <li>Create a "popular products" page as ultimate fallback for unmatched categories</li>
      <li>Enable low stock alerts for products in active paid campaigns</li>
      <li>Use back-in-stock landing pages to capture emails during stockouts</li>
    </ul>

    <h2>Plan availability</h2>
    <p>
      Shopify sync is available on <strong>Business</strong> plans and above.
    </p>
  </HelpArticleLayout>
);

export default SentinelShopifySync;
