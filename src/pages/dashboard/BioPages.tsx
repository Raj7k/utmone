import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function BioPages() {
  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Back to Dashboard Link */}
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 text-sm text-secondary-label hover:text-label transition-apple"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display font-semibold text-label">Bio Pages</h2>
          <p className="text-sm text-secondary-label mt-1">Create beautiful link-in-bio pages</p>
        </div>
      </div>

      <Card variant="grouped">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Bio pages feature is under development</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-body-apple text-secondary-label">
            We're building a powerful bio page builder that will let you create beautiful link-in-bio pages
            with full customization, analytics tracking, and seamless integration with your short links.
          </p>

          <div className="bg-muted/20 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-label">Planned Features:</h4>
            <ul className="space-y-1 text-sm text-secondary-label">
              <li>• Drag-and-drop link management</li>
              <li>• Custom themes and branding</li>
              <li>• Advanced analytics per link</li>
              <li>• Social media integrations</li>
              <li>• Custom domains support</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://docs.utm.one" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
