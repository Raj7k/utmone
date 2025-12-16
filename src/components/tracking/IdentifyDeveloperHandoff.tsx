import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Mail, Tag, Code, ExternalLink, CheckCircle2, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type SetupOption = 'gtm' | 'developer' | 'self' | null;

interface IdentifyDeveloperHandoffProps {
  pixelId: string;
}

export const IdentifyDeveloperHandoff: React.FC<IdentifyDeveloperHandoffProps> = ({ pixelId }) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [setupOption, setSetupOption] = useState<SetupOption>(null);

  const copyToClipboard = async (text: string, snippetName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSnippet(snippetName);
      toast.success(`${snippetName} copied`);
      setTimeout(() => setCopiedSnippet(null), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  // GTM dataLayer snippet for developers
  const gtmDataLayerSnippet = `// Add this after successful login/signup
dataLayer.push({
  'event': 'user_logged_in',
  'user_email': userEmail,    // logged-in user's email
  'user_name': userName       // user's name (optional)
});`;

  // Direct identify snippet
  const directIdentifySnippet = `// Add this after successful login/signup
utmone('identify', userEmail, userName);`;

  // GTM Custom HTML Tag
  const gtmTagSnippet = `<script>
  utmone('identify', {{DL - user_email}}, {{DL - user_name}});
</script>`;

  // Platform-specific snippets
  const wordpressSnippet = `<?php
// File: functions.php (your theme) or a site-specific plugin
// Location: wp-content/themes/your-theme/functions.php

add_action('wp_login', 'utmone_identify_user', 10, 2);
function utmone_identify_user($user_login, $user) {
  ?>
  <script>
    if (typeof utmone !== 'undefined') {
      utmone('identify', '<?php echo esc_js($user->user_email); ?>', '<?php echo esc_js($user->display_name); ?>');
    }
  </script>
  <?php
}
?>`;

  const shopifySnippet = `{% comment %}
  File: layout/theme.liquid
  Location: Paste before </body> tag at the bottom of the file
  Path: Online Store → Themes → Edit code → Layout → theme.liquid
{% endcomment %}

{% if customer %}
<script>
  if (typeof utmone !== 'undefined') {
    utmone('identify', '{{ customer.email }}', '{{ customer.name }}');
  }
</script>
{% endif %}`;

  const reactSnippet = `// File: src/hooks/useIdentifyUser.js (create this file)
// Location: src/hooks/ folder

import { useEffect } from 'react';
import { useAuth } from './AuthProvider'; // adjust import to your auth provider

export function useIdentifyUser() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user && window.utmone) {
      window.utmone('identify', user.email, user.displayName);
    }
  }, [user]);
}

// Then in your app's root component (App.jsx or _app.js):
// import { useIdentifyUser } from './hooks/useIdentifyUser';
// 
// function App() {
//   useIdentifyUser(); // Add this line
//   return <YourApp />;
// }`;

  const nextjsSnippet = `// File: app/providers.tsx or components/IdentifyUser.tsx
// Location: Inside your SessionProvider wrapper
// Works with NextAuth, Clerk, Supabase Auth, etc.

'use client';
import { useSession } from 'next-auth/react'; // or your auth provider
import { useEffect } from 'react';

export function IdentifyUser() {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session?.user && typeof window !== 'undefined' && window.utmone) {
      window.utmone('identify', session.user.email, session.user.name);
    }
  }, [session]);
  
  return null;
}

// In your root layout.tsx or _app.tsx:
// <SessionProvider>
//   <IdentifyUser />  {/* Add this component */}
//   {children}
// </SessionProvider>`;

  // Developer email template
  const developerEmailSubject = `Quick code addition for utm.one tracking (5 min task)`;
  const developerEmailBody = `Hi,

We're using utm.one for marketing attribution. To enable 100% accurate cross-device tracking, we need a small code addition after user login.

WHAT TO ADD:
After successful login/signup, add this JavaScript:

${setupOption === 'gtm' ? `// For GTM - push to dataLayer:
${gtmDataLayerSnippet}` : `// Call directly:
${directIdentifySnippet}`}

WHERE TO ADD IT:
In the success callback of your login/signup function, after authentication succeeds and you have access to the user object.

PLATFORM-SPECIFIC EXAMPLES:

1. REACT (src/hooks/useIdentifyUser.js):
${reactSnippet}

2. NEXT.JS (app/providers.tsx):
${nextjsSnippet}

3. WORDPRESS (functions.php):
${wordpressSnippet}

4. SHOPIFY (theme.liquid before </body>):
${shopifySnippet}

This is optional but improves our marketing attribution accuracy from ~85% to 100% for cross-device tracking.

Thanks!`;

  const handleEmailDeveloper = () => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(developerEmailSubject)}&body=${encodeURIComponent(developerEmailBody)}`;
    
    // Use window.location.href instead of window.open for better mailto support
    window.location.href = mailtoLink;
    
    // Show a fallback toast in case email client doesn't open
    setTimeout(() => {
      toast.info("Email client should open. If not, copy the instructions below.", {
        action: {
          label: "Copy All",
          onClick: () => copyToClipboard(developerEmailBody, 'Developer instructions'),
        },
      });
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Setup option selector */}
      <div>
        <p className="text-sm text-muted-foreground mb-3">how do you want to set this up?</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setSetupOption('gtm')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all text-center",
              setupOption === 'gtm'
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            )}
          >
            <Tag className="h-5 w-5 text-amber-500" />
            <span className="text-xs font-medium text-foreground">I use GTM</span>
          </button>
          <button
            onClick={() => setSetupOption('developer')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all text-center",
              setupOption === 'developer'
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            )}
          >
            <Mail className="h-5 w-5 text-blue-500" />
            <span className="text-xs font-medium text-foreground">ask developer</span>
          </button>
          <button
            onClick={() => setSetupOption('self')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all text-center",
              setupOption === 'self'
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            )}
          >
            <Code className="h-5 w-5 text-green-500" />
            <span className="text-xs font-medium text-foreground">I can code</span>
          </button>
        </div>
      </div>

      {/* GTM Instructions */}
      {setupOption === 'gtm' && (
        <div className="space-y-4 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-foreground">GTM setup (2 parts)</span>
          </div>

          {/* Part 1: Developer adds dataLayer */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">STEP 1</Badge>
              <span className="text-xs font-medium text-foreground">developer adds this after login</span>
            </div>
            <div className="relative">
              <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-border text-zinc-300">
                <code>{gtmDataLayerSnippet}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 h-7"
                onClick={() => copyToClipboard(gtmDataLayerSnippet, 'GTM dataLayer')}
              >
                {copiedSnippet === 'GTM dataLayer' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Part 2: GTM Configuration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">STEP 2</Badge>
              <span className="text-xs font-medium text-foreground">you configure in GTM</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2 bg-card rounded border border-border">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Create Variables</p>
                  <p className="text-muted-foreground">Variables → New → Data Layer Variable</p>
                  <p className="text-muted-foreground">Name: <code className="bg-muted px-1 rounded">DL - user_email</code>, Value: <code className="bg-muted px-1 rounded">user_email</code></p>
                  <p className="text-muted-foreground">Name: <code className="bg-muted px-1 rounded">DL - user_name</code>, Value: <code className="bg-muted px-1 rounded">user_name</code></p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-card rounded border border-border">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Create Trigger</p>
                  <p className="text-muted-foreground">Triggers → New → Custom Event</p>
                  <p className="text-muted-foreground">Event name: <code className="bg-muted px-1 rounded">user_logged_in</code></p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-card rounded border border-border">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Create Tag</p>
                  <p className="text-muted-foreground">Tags → New → Custom HTML</p>
                  <div className="relative mt-2">
                    <pre className="bg-zinc-950 p-2 rounded text-[10px] font-mono text-zinc-300">
                      <code>{gtmTagSnippet}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(gtmTagSnippet, 'GTM Tag')}
                    >
                      {copiedSnippet === 'GTM Tag' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <p className="text-muted-foreground mt-1">Trigger: <code className="bg-muted px-1 rounded">user_logged_in</code></p>
                </div>
              </div>
            </div>
          </div>

          {/* Email developer button for GTM */}
          <div className="pt-3 border-t border-amber-500/20">
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleEmailDeveloper}>
              <Mail className="h-4 w-4" />
              email step 1 to developer
            </Button>
          </div>
        </div>
      )}

      {/* Developer Instructions */}
      {setupOption === 'developer' && (
        <div className="space-y-4 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-foreground">send to your developer</span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            click the button below to open an email with ready-to-use instructions including platform-specific code for WordPress, Shopify, React, and Next.js.
          </p>

          <div className="relative">
            <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-border text-zinc-300">
              <code>{directIdentifySnippet}</code>
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 h-7"
              onClick={() => copyToClipboard(directIdentifySnippet, 'Identify code')}
            >
              {copiedSnippet === 'Identify code' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>

          <Button className="w-full gap-2" onClick={handleEmailDeveloper}>
            <Mail className="h-4 w-4" />
            email instructions to developer
          </Button>
          
          <p className="text-[10px] text-muted-foreground text-center">
            includes platform-specific snippets for WordPress, Shopify, React, Next.js
          </p>
        </div>
      )}

      {/* Self-service Instructions with Platform Tabs */}
      {setupOption === 'self' && (
        <div className="space-y-4 p-4 bg-green-500/5 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-foreground">platform-specific setup guides</span>
          </div>

          <Tabs defaultValue="react" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              <TabsTrigger value="react" className="text-xs py-1.5">React</TabsTrigger>
              <TabsTrigger value="nextjs" className="text-xs py-1.5">Next.js</TabsTrigger>
              <TabsTrigger value="wordpress" className="text-xs py-1.5">WordPress</TabsTrigger>
              <TabsTrigger value="shopify" className="text-xs py-1.5">Shopify</TabsTrigger>
            </TabsList>

            {/* React */}
            <TabsContent value="react" className="space-y-3 mt-3">
              <div className="flex items-center gap-2 text-xs">
                <FileCode className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-foreground">File:</span>
                <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">src/hooks/useIdentifyUser.js</code>
              </div>
              <div className="relative">
                <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-3 rounded-lg text-[10px] font-mono overflow-x-auto border border-border text-zinc-300 max-h-[200px]">
                  <code>{reactSnippet}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 h-6"
                  onClick={() => copyToClipboard(reactSnippet, 'React code')}
                >
                  {copiedSnippet === 'React code' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <div className="p-2 bg-blue-500/10 rounded text-[10px] text-blue-700 dark:text-blue-300">
                <strong>Steps:</strong> 1) Create the hook file, 2) Import and call <code>useIdentifyUser()</code> in your App component
              </div>
            </TabsContent>

            {/* Next.js */}
            <TabsContent value="nextjs" className="space-y-3 mt-3">
              <div className="flex items-center gap-2 text-xs">
                <FileCode className="h-4 w-4 text-zinc-800 dark:text-zinc-200" />
                <span className="font-medium text-foreground">File:</span>
                <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">app/providers.tsx</code>
              </div>
              <div className="relative">
                <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-3 rounded-lg text-[10px] font-mono overflow-x-auto border border-border text-zinc-300 max-h-[200px]">
                  <code>{nextjsSnippet}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 h-6"
                  onClick={() => copyToClipboard(nextjsSnippet, 'Next.js code')}
                >
                  {copiedSnippet === 'Next.js code' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <div className="p-2 bg-zinc-500/10 rounded text-[10px] text-zinc-700 dark:text-zinc-300">
                <strong>Steps:</strong> 1) Create component, 2) Add <code>&lt;IdentifyUser /&gt;</code> inside your SessionProvider
              </div>
            </TabsContent>

            {/* WordPress */}
            <TabsContent value="wordpress" className="space-y-3 mt-3">
              <div className="flex items-center gap-2 text-xs">
                <FileCode className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-foreground">File:</span>
                <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">wp-content/themes/your-theme/functions.php</code>
              </div>
              <div className="relative">
                <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-3 rounded-lg text-[10px] font-mono overflow-x-auto border border-border text-zinc-300 max-h-[200px]">
                  <code>{wordpressSnippet}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 h-6"
                  onClick={() => copyToClipboard(wordpressSnippet, 'WordPress code')}
                >
                  {copiedSnippet === 'WordPress code' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <div className="p-2 bg-blue-600/10 rounded text-[10px] text-blue-700 dark:text-blue-300">
                <strong>Steps:</strong> 1) Open functions.php via Appearance → Theme Editor, 2) Paste at the end of file, 3) Save
              </div>
            </TabsContent>

            {/* Shopify */}
            <TabsContent value="shopify" className="space-y-3 mt-3">
              <div className="flex items-center gap-2 text-xs">
                <FileCode className="h-4 w-4 text-green-600" />
                <span className="font-medium text-foreground">File:</span>
                <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">layout/theme.liquid</code>
              </div>
              <div className="relative">
                <pre className="bg-zinc-950 dark:bg-zinc-900/50 p-3 rounded-lg text-[10px] font-mono overflow-x-auto border border-border text-zinc-300 max-h-[200px]">
                  <code>{shopifySnippet}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 h-6"
                  onClick={() => copyToClipboard(shopifySnippet, 'Shopify code')}
                >
                  {copiedSnippet === 'Shopify code' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <div className="p-2 bg-green-600/10 rounded text-[10px] text-green-700 dark:text-green-300">
                <strong>Steps:</strong> 1) Online Store → Themes → Edit code, 2) Open Layout → theme.liquid, 3) Paste before <code>&lt;/body&gt;</code>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default IdentifyDeveloperHandoff;
