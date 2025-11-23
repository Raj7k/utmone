import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            back to home
          </Button>
        </Link>

        <h1 className="text-5xl font-display font-bold mb-8 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">privacy policy</h1>
        <p className="text-xl text-muted-foreground mb-12">
          last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-12 text-lg leading-relaxed">
          <section>
            <h2 className="text-3xl font-bold mb-4">what we collect</h2>
            <p className="mb-4">
              when you use utm.one, we collect information necessary to provide our link management service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>ip address (for geolocation analytics and fraud prevention)</li>
              <li>user agent (device type, browser, operating system)</li>
              <li>referrer (where clicks came from)</li>
              <li>click timestamp and location data</li>
              <li>account information (email, workspace settings)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">why we collect it</h2>
            <p className="mb-4">we use this data to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>provide click analytics and campaign insights</li>
              <li>detect fraudulent activity and abuse</li>
              <li>improve our product and user experience</li>
              <li>comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">how long we keep it</h2>
            <p className="mb-4 text-muted-foreground">
              by default, we retain granular click data (ip addresses, user agents) for 90 days. 
              after that, we keep only aggregated analytics (country-level, device types) indefinitely 
              for historical trend analysis. you can adjust your retention period in settings.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">your rights</h2>
            <p className="mb-4">you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>access:</strong> request a copy of all your data</li>
              <li><strong>export:</strong> download your data in machine-readable format</li>
              <li><strong>delete:</strong> request deletion of your account and data</li>
              <li><strong>opt-out:</strong> disable tracking for your links</li>
              <li><strong>portability:</strong> take your data to another service</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              manage your data preferences in settings → data & privacy, or contact us at privacy@utm.one
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">security</h2>
            <p className="text-muted-foreground">
              we encrypt all data in transit (tls 1.3) and at rest (aes-256). access to personal 
              data is strictly limited to authorized personnel. we conduct regular security audits 
              and maintain soc 2 compliance.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">third parties</h2>
            <p className="text-muted-foreground mb-4">
              we do not sell your data. we share data only with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>cloud infrastructure providers (aws, supabase) for hosting</li>
              <li>analytics tools (for product improvement only)</li>
              <li>law enforcement (when legally required)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">cookies</h2>
            <p className="text-muted-foreground">
              we use essential cookies for authentication. no tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">gdpr & ccpa compliance</h2>
            <p className="text-muted-foreground">
              we are fully compliant with gdpr (europe) and ccpa (california). if you are a resident 
              of the eu or california, you have additional rights including the right to request deletion 
              and opt-out of data processing.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">contact</h2>
            <p className="text-muted-foreground">
              questions about privacy? email us at <strong>privacy@utm.one</strong>
            </p>
          </section>

          <section className="pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              this policy may be updated periodically. continued use of utm.one after changes 
              constitutes acceptance of the updated policy. major changes will be announced via email.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
