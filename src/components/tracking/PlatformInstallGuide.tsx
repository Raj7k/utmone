import React, { useState } from 'react';
import { Check, ChevronRight, Copy, ExternalLink, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AnimatedStepIndicator from './AnimatedStepIndicator';
import { getPlatformIcon, platformColors } from './PlatformIcons';

interface Step {
  title: string;
  description: string;
  hint?: string;
  code?: string;
  visual?: 'menu' | 'editor' | 'save';
}

interface PlatformGuide {
  name: string;
  color: string;
  steps: Step[];
  videoUrl?: string;
}

const platformGuides: Record<string, PlatformGuide> = {
  wordpress: {
    name: 'WordPress',
    color: platformColors.wordpress,
    steps: [
      {
        title: 'Open WordPress Admin',
        description: 'Go to yoursite.com/wp-admin and log in',
        hint: 'Use your WordPress username and password',
        visual: 'menu',
      },
      {
        title: 'Go to Appearance → Theme Editor',
        description: 'Find "Appearance" in the left sidebar, then click "Theme Editor"',
        hint: 'If using a page builder, look for "Custom Code" or "Header Scripts" instead',
        visual: 'menu',
      },
      {
        title: 'Open header.php',
        description: 'In the file list on the right, click "header.php"',
        hint: 'If you have a child theme, use the child theme\'s header.php',
        visual: 'editor',
      },
      {
        title: 'Paste code before </head>',
        description: 'Find the </head> tag and paste the pixel code just before it',
        hint: 'Use Ctrl+F (or Cmd+F on Mac) to search for "</head>"',
        visual: 'editor',
      },
      {
        title: 'Click "Update File"',
        description: 'Save your changes by clicking the blue "Update File" button',
        hint: 'If you see an error, your hosting may have file editing disabled',
        visual: 'save',
      },
    ],
  },
  shopify: {
    name: 'Shopify',
    color: platformColors.shopify,
    steps: [
      {
        title: 'Open Shopify Admin',
        description: 'Go to yourstore.myshopify.com/admin',
        hint: 'Or click "Admin" from your Shopify dashboard',
        visual: 'menu',
      },
      {
        title: 'Go to Online Store → Themes',
        description: 'In the left sidebar, click "Online Store" then "Themes"',
        hint: 'Make sure you\'re editing your live theme, not a draft',
        visual: 'menu',
      },
      {
        title: 'Click Actions → Edit Code',
        description: 'Find the "Actions" dropdown on your current theme and select "Edit code"',
        hint: 'You can also click the "..." menu next to "Customize"',
        visual: 'menu',
      },
      {
        title: 'Open theme.liquid',
        description: 'In the Layout folder, click "theme.liquid"',
        hint: 'This is the main template file that loads on every page',
        visual: 'editor',
      },
      {
        title: 'Paste code before </head>',
        description: 'Find </head> and paste the pixel code just before it',
        hint: 'The </head> tag is usually around line 100-200',
        visual: 'editor',
      },
      {
        title: 'Click Save',
        description: 'Click the green "Save" button in the top right',
        hint: 'Changes go live immediately - no publish needed',
        visual: 'save',
      },
    ],
  },
  wix: {
    name: 'Wix',
    color: platformColors.wix,
    steps: [
      {
        title: 'Open Wix Dashboard',
        description: 'Go to manage.wix.com and select your site',
        hint: 'Make sure you\'re on the site you want to add tracking to',
        visual: 'menu',
      },
      {
        title: 'Go to Settings',
        description: 'Click "Settings" in the left sidebar',
        hint: 'Not the Editor settings - use the Dashboard settings',
        visual: 'menu',
      },
      {
        title: 'Click Custom Code',
        description: 'Scroll down and click "Custom Code" under Advanced',
        hint: 'You might need to scroll down to find this option',
        visual: 'menu',
      },
      {
        title: 'Add Code to Head',
        description: 'Click "+ Add Custom Code" and select "Head" placement',
        hint: 'Name it "utm.one tracking" so you can find it later',
        visual: 'editor',
      },
      {
        title: 'Paste & Apply',
        description: 'Paste the pixel code and click "Apply"',
        hint: 'Make sure "Add Code to Pages" is set to "All Pages"',
        visual: 'save',
      },
    ],
  },
  squarespace: {
    name: 'Squarespace',
    color: platformColors.squarespace,
    steps: [
      {
        title: 'Open Site Settings',
        description: 'From your site dashboard, click "Settings"',
        hint: 'Look for the gear icon in the left sidebar',
        visual: 'menu',
      },
      {
        title: 'Click Advanced',
        description: 'Scroll down in Settings and click "Advanced"',
        hint: 'This is near the bottom of the settings list',
        visual: 'menu',
      },
      {
        title: 'Click Code Injection',
        description: 'Select "Code Injection" from the Advanced menu',
        hint: 'You need a Business plan or higher for this feature',
        visual: 'menu',
      },
      {
        title: 'Paste in Header box',
        description: 'Paste the pixel code in the "Header" text box',
        hint: 'This adds the code to every page on your site',
        visual: 'editor',
      },
      {
        title: 'Click Save',
        description: 'Click "Save" in the top left corner',
        hint: 'The code goes live immediately after saving',
        visual: 'save',
      },
    ],
  },
  webflow: {
    name: 'Webflow',
    color: platformColors.webflow,
    steps: [
      {
        title: 'Open Project Settings',
        description: 'Click the gear icon in the left sidebar of the Designer',
        hint: 'Or click your project name and select "Project Settings"',
        visual: 'menu',
      },
      {
        title: 'Go to Custom Code tab',
        description: 'Click the "Custom Code" tab at the top',
        hint: 'This is different from page-specific custom code',
        visual: 'menu',
      },
      {
        title: 'Paste in Head Code',
        description: 'Paste the pixel code in the "Head Code" section',
        hint: 'This applies to all pages including CMS pages',
        visual: 'editor',
      },
      {
        title: 'Save & Publish',
        description: 'Click "Save Changes" then publish your site',
        hint: 'Code only goes live after publishing',
        visual: 'save',
      },
    ],
  },
  gtm: {
    name: 'Google Tag Manager',
    color: platformColors.gtm,
    steps: [
      {
        title: 'Open GTM Container',
        description: 'Go to tagmanager.google.com and select your container',
        hint: 'Create a new container if you don\'t have one',
        visual: 'menu',
      },
      {
        title: 'Click "New Tag"',
        description: 'In the Tags section, click "New" to create a tag',
        hint: 'You\'ll see this in the left sidebar',
        visual: 'menu',
      },
      {
        title: 'Choose Custom HTML',
        description: 'Click "Tag Configuration" then select "Custom HTML"',
        hint: 'Scroll down in the tag type list to find it',
        visual: 'menu',
      },
      {
        title: 'Paste the pixel code',
        description: 'Paste the full pixel code including <script> tags',
        hint: 'Include everything from the code snippet',
        visual: 'editor',
      },
      {
        title: 'Set Trigger to "All Pages"',
        description: 'Click "Triggering" and select "All Pages"',
        hint: 'This fires the tag on every page view',
        visual: 'menu',
      },
      {
        title: 'Save & Submit',
        description: 'Name your tag "utm.one Pixel", save, then click "Submit"',
        hint: 'Don\'t forget to publish! Preview first to test.',
        visual: 'save',
      },
    ],
  },
  react: {
    name: 'React / Next.js',
    color: platformColors.react,
    steps: [
      {
        title: 'Open your main App file',
        description: 'Find App.tsx, _app.tsx, or layout.tsx depending on your setup',
        hint: 'For Next.js 13+, use app/layout.tsx',
        visual: 'editor',
      },
      {
        title: 'Add useEffect hook',
        description: 'Import useEffect and add the pixel script on mount',
        hint: 'Make sure to only run this on the client side',
        code: `useEffect(() => {
  const script = document.createElement('script');
  script.innerHTML = \`/* pixel code here */\`;
  document.head.appendChild(script);
}, []);`,
        visual: 'editor',
      },
      {
        title: 'Or use next/script',
        description: 'For Next.js, you can use the Script component',
        hint: 'This is the recommended approach for Next.js',
        code: `import Script from 'next/script';
// In your component:
<Script id="utm-one-pixel" strategy="afterInteractive">
  {\`/* pixel code here */\`}
</Script>`,
        visual: 'editor',
      },
    ],
  },
  html: {
    name: 'Direct HTML',
    color: platformColors.html,
    steps: [
      {
        title: 'Open your HTML file',
        description: 'Open the HTML file in your code editor',
        hint: 'Usually index.html or your main template file',
        visual: 'editor',
      },
      {
        title: 'Find the </head> tag',
        description: 'Look for the closing head tag in your HTML',
        hint: 'It\'s usually near the top of the file',
        visual: 'editor',
      },
      {
        title: 'Paste the pixel code',
        description: 'Paste the code snippet just before </head>',
        hint: 'Make sure it\'s inside the <head> section',
        visual: 'editor',
      },
      {
        title: 'Save & upload',
        description: 'Save the file and upload it to your server',
        hint: 'Clear your cache after uploading',
        visual: 'save',
      },
    ],
  },
};

interface PlatformInstallGuideProps {
  platform: string;
  pixelId: string;
  installType?: 'main' | 'revenue';
}

const PlatformInstallGuide: React.FC<PlatformInstallGuideProps> = ({ platform, pixelId, installType = 'main' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const guide = platformGuides[platform];
  const PlatformIcon = getPlatformIcon(platform);

  if (!guide) return null;

  const handleCopyCode = () => {
    const code = `<script>
(function(w,d,p){
  w.utmone=w.utmone||function(){(w.utmone.q=w.utmone.q||[]).push(arguments)};
  var s=d.createElement('script');s.async=1;
  s.src='https://go.utm.one/pixel.js';
  s.onload=function(){utmone('init','${pixelId}')};
  d.head.appendChild(s);
})(window,document);
</script>`;
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const currentStepData = guide.steps[currentStep - 1];

  return (
    <div className="space-y-6">
      {/* Platform header */}
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${guide.color}20` }}
        >
          <PlatformIcon className="w-5 h-5" style={{ color: guide.color }} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">{guide.name} Installation</h3>
          <p className="text-xs text-muted-foreground">
            {guide.steps.length} simple steps
          </p>
        </div>
      </div>

      {/* Progress indicator */}
      <AnimatedStepIndicator
        currentStep={currentStep}
        totalSteps={guide.steps.length}
        labels={guide.steps.map((s, i) => `Step ${i + 1}`)}
      />

      {/* Current step content */}
      <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
        {/* Step header */}
        <div className="flex items-start gap-4 mb-4">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: guide.color }}
          >
            {currentStep}
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-foreground mb-1">
              {currentStepData.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Visual hint */}
        {currentStepData.visual && (
          <div className="mb-4 rounded-lg overflow-hidden border border-border/30">
            <div className="bg-zinc-900 p-4 flex items-center justify-center min-h-[120px]">
              {currentStepData.visual === 'menu' && (
                <div className="flex items-center gap-2 text-white/60">
                  <div className="flex flex-col gap-1">
                    <div className="w-20 h-3 bg-white/10 rounded" />
                    <div className="w-24 h-3 bg-white/20 rounded animate-pulse" />
                    <div className="w-16 h-3 bg-white/10 rounded" />
                  </div>
                  <ChevronRight className="w-4 h-4" />
                  <div className="flex flex-col gap-1">
                    <div className="w-16 h-3 bg-white/10 rounded" />
                    <div className="w-20 h-3 bg-primary/40 rounded animate-pulse" />
                  </div>
                </div>
              )}
              {currentStepData.visual === 'editor' && (
                <div className="w-full max-w-[280px] font-mono text-[10px] text-white/50 space-y-1">
                  <div className="text-white/30">&lt;html&gt;</div>
                  <div className="text-white/30 ml-2">&lt;head&gt;</div>
                  <div className="text-white/30 ml-4">...</div>
                  <div className="ml-4 px-2 py-1 bg-primary/20 rounded border border-primary/30 text-primary animate-pulse">
                    ← paste code here
                  </div>
                  <div className="text-white/30 ml-2">&lt;/head&gt;</div>
                </div>
              )}
              {currentStepData.visual === 'save' && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-primary rounded-lg text-white text-sm font-medium animate-pulse">
                      Save
                    </div>
                  </div>
                  <Check className="w-6 h-6 text-green-500" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Code snippet if applicable */}
        {currentStepData.code && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <pre className="bg-zinc-950 p-4 text-xs text-white/70 overflow-x-auto">
              <code>{currentStepData.code}</code>
            </pre>
          </div>
        )}

        {/* Hint */}
        {currentStepData.hint && (
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <span className="text-amber-500 text-sm">💡</span>
            <p className="text-xs text-amber-500/90">{currentStepData.hint}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentStep === guide.steps.length - 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="gap-2"
            >
              <Copy className="w-3 h-3" />
              Copy Code
            </Button>
          )}
          
          {currentStep < guide.steps.length ? (
            <Button
              size="sm"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="gap-2"
            >
              Next Step
              <ChevronRight className="w-3 h-3" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleCopyCode}
              className="gap-2"
            >
              <Check className="w-3 h-3" />
              Done - Copy Code
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformInstallGuide;
