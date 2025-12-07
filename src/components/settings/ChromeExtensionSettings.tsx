import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chrome, Download, Zap, Globe, QrCode, Link2, Copy, ExternalLink, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const ChromeExtensionSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const features = [
    {
      icon: Zap,
      title: "instant link creation",
      description: "create short links in under 5 seconds without leaving your current tab"
    },
    {
      icon: Globe,
      title: "smart context detection",
      description: "auto-detects source from current site (twitter, linkedin, youtube, etc.)"
    },
    {
      icon: QrCode,
      title: "one-click qr codes",
      description: "generate branded qr codes instantly for any link you create"
    },
    {
      icon: Link2,
      title: "utm auto-fill",
      description: "pre-fills utm parameters based on page context and your templates"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "install extension",
      description: "download from chrome web store or install manually"
    },
    {
      step: 2,
      title: "connect your api key",
      description: "paste your api key to authenticate the extension"
    },
    {
      step: 3,
      title: "start creating",
      description: "click the extension icon on any page to create links instantly"
    }
  ];

  const handleCopyApiKeyLink = () => {
    navigate("/settings?tab=developers");
    toast({
      title: "navigating to api keys",
      description: "copy your api key from the developer settings"
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Chrome className="h-8 w-8 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  power tool
                </Badge>
              </div>
              
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  utm.one chrome extension
                </h2>
                <p className="text-muted-foreground text-lg">
                  create links without leaving your tab. perfect for social media managers 
                  and marketers who need to share links during active campaigns.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2">
                  <Download className="h-4 w-4" />
                  download extension
                  <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleCopyApiKeyLink} className="gap-2">
                  <Copy className="h-4 w-4" />
                  get api key
                </Button>
              </div>
            </div>

            {/* Extension Preview Mockup */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <Chrome className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">utm.one sidebar</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">current page</p>
                    <p className="text-sm font-medium truncate">twitter.com/elonmusk</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">short link</p>
                    <p className="text-sm font-medium text-primary">utm.one/abc123</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-primary/10 rounded-lg p-2 text-center">
                      <Copy className="h-4 w-4 mx-auto text-primary mb-1" />
                      <p className="text-xs">copy</p>
                    </div>
                    <div className="flex-1 bg-primary/10 rounded-lg p-2 text-center">
                      <QrCode className="h-4 w-4 mx-auto text-primary mb-1" />
                      <p className="text-xs">qr code</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">quick setup guide</CardTitle>
          <CardDescription>get started in 3 simple steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.step} className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">{step.step}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {step.step < 3 && (
                  <div className="hidden md:block absolute top-5 left-[calc(100%-20px)] w-8 border-t-2 border-dashed border-border" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">what you get</CardTitle>
          <CardDescription>features that save you time every day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Manual Install Section */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg font-display">manual installation</CardTitle>
          <CardDescription>for developers or if the chrome web store isn't available</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Download the extension package from our GitHub releases</li>
            <li>Open Chrome and navigate to <code className="bg-muted px-1 rounded">chrome://extensions</code></li>
            <li>Enable "Developer mode" in the top right corner</li>
            <li>Click "Load unpacked" and select the extension folder</li>
          </ol>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            view on github
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
