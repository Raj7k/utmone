/**
 * URLShortenerPro Component
 * Advanced URL shortening for authenticated users with campaign management
 */

import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Link2, BarChart3, QrCode, Target, Upload, Download, 
  Copy, CheckCircle2, Loader2, Sparkles, Calendar, Shield, Lock
} from 'lucide-react';
import { proUrlSchema, type ProURLFormData } from '@/lib/urlShortenerSchemas';
import { useURLProcessing } from './hooks/useURLProcessing';
import { URLPreviewCard } from './shared/URLPreviewCard';
import { ProcessingProgress } from './shared/ProcessingProgress';
import { PAGINATION_LIMIT } from '@/lib/constants';

export const URLShortenerPro = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { processURL, generateRandomSlug } = useURLProcessing();
  const [activeTab, setActiveTab] = useState('create');
  const [bulkInput, setBulkInput] = useState('');
  const [processedLinks, setProcessedLinks] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get current user's workspace
  const { data: workspace } = useQuery({
    queryKey: ['current-workspace'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('not authenticated');

      const { data } = await supabase
        .from('workspaces')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      return data;
    },
  });

  // Fetch verified domains
  const { data: domains } = useQuery({
    queryKey: ['verified-domains', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      
      const { data } = await supabase
        .from('domains')
        .select('id, domain')
        .eq('is_verified', true)
        .or(`workspace_id.eq.${workspace.id},is_system_domain.eq.true`)
        .limit(PAGINATION_LIMIT);

      return data || [];
    },
    enabled: !!workspace?.id,
  });

  // Fetch recent links with pagination
  const { data: recentLinks } = useQuery({
    queryKey: ['recent-links', workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];
      
      const { data } = await supabase
        .from('links')
        .select('id, title, slug, domain, destination_url, total_clicks, created_at')
        .eq('workspace_id', workspace.id)
        .order('created_at', { ascending: false })
        .limit(5);

      return data || [];
    },
    enabled: !!workspace?.id,
  });

  const form = useForm<ProURLFormData>({
    resolver: zodResolver(proUrlSchema),
    defaultValues: {
      url: '',
      title: '',
      slug: '',
      domain: 'utm.click',
    },
  });

  // Create link mutation
  const createLinkMutation = useMutation({
    mutationFn: async (data: ProURLFormData) => {
      if (!workspace?.id) throw new Error('no workspace found');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('not authenticated');

      const { data: link, error } = await supabase
        .from('links')
        .insert({
          workspace_id: workspace.id,
          created_by: user.id,
          title: data.title,
          slug: data.slug,
          destination_url: data.url,
          final_url: data.url,
          domain: data.domain,
          path: '',
          utm_source: data.utm_source || null,
          utm_medium: data.utm_medium || null,
          utm_campaign: data.utm_campaign || null,
          utm_term: data.utm_term || null,
          utm_content: data.utm_content || null,
          expires_at: data.expires_at || null,
          max_clicks: data.max_clicks || null,
          fallback_url: data.fallback_url || null,
          password: data.password || null,
        })
        .select()
        .single();

      if (error) throw error;
      return link;
    },
    onSuccess: (link) => {
      queryClient.invalidateQueries({ queryKey: ['recent-links'] });
      toast({
        title: 'link created',
        description: `https://${link.domain}/${link.slug}`,
      });
      form.reset();
      setProcessedLinks(prev => [link, ...prev]);
    },
    onError: (error: Error) => {
      toast({
        title: 'error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleBulkProcess = useCallback(async () => {
    if (!workspace?.id) return;
    
    setIsProcessing(true);
    const urls = bulkInput.split('\n').filter(line => line.trim());
    const processed: any[] = [];

    for (const url of urls) {
      const result = processURL(url.trim(), {
        autoAlias: true,
        domain: form.getValues('domain'),
      });

      if (result) {
        processed.push(result);
      }
    }

    setProcessedLinks(processed);
    setIsProcessing(false);
    setBulkInput('');
    
    toast({
      title: 'bulk processing complete',
      description: `processed ${processed.length} urls`,
    });
  }, [bulkInput, workspace?.id, processURL, form]);

  const onSubmit = (data: ProURLFormData) => {
    createLinkMutation.mutate(data);
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 font-display">URL Shortener Pro</h1>
        <p className="text-secondary-label">advanced link creation with campaign management</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="create">
            <Link2 className="h-4 w-4 mr-2" />
            Create
          </TabsTrigger>
          <TabsTrigger value="bulk">
            <Upload className="h-4 w-4 mr-2" />
            Bulk
          </TabsTrigger>
          <TabsTrigger value="recent">
            <BarChart3 className="h-4 w-4 mr-2" />
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Short Link</CardTitle>
              <CardDescription>generate a custom short link with utm parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="url">Destination URL *</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/landing-page"
                    {...form.register('url')}
                    className="mt-1.5"
                  />
                  {form.formState.errors.url && (
                    <p className="text-xs text-system-red mt-1">
                      {form.formState.errors.url.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="title">Link Title *</Label>
                  <Input
                    id="title"
                    placeholder="Summer Sale Campaign"
                    {...form.register('title')}
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="domain">Domain</Label>
                    <Select 
                      value={form.watch('domain')} 
                      onValueChange={(value) => form.setValue('domain', value)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {domains?.map((d) => (
                          <SelectItem key={d.id} value={d.domain}>
                            {d.domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="slug">Custom Slug *</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        id="slug"
                        placeholder="my-link"
                        {...form.register('slug')}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => form.setValue('slug', generateRandomSlug())}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="utm">
                    <AccordionTrigger>UTM Parameters</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="utm_source">Source</Label>
                          <Input
                            id="utm_source"
                            placeholder="newsletter"
                            {...form.register('utm_source')}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="utm_medium">Medium</Label>
                          <Input
                            id="utm_medium"
                            placeholder="email"
                            {...form.register('utm_medium')}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="utm_campaign">Campaign</Label>
                        <Input
                          id="utm_campaign"
                          placeholder="summer-sale-2024"
                          {...form.register('utm_campaign')}
                          className="mt-1.5"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="utm_term">Term</Label>
                          <Input
                            id="utm_term"
                            placeholder="discount"
                            {...form.register('utm_term')}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="utm_content">Content</Label>
                          <Input
                            id="utm_content"
                            placeholder="cta-button"
                            {...form.register('utm_content')}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="advanced">
                    <AccordionTrigger>Advanced Options</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="expires_at">Expiry Date</Label>
                        <Input
                          id="expires_at"
                          type="datetime-local"
                          {...form.register('expires_at')}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max_clicks">Max Clicks</Label>
                        <Input
                          id="max_clicks"
                          type="number"
                          placeholder="1000"
                          {...form.register('max_clicks', { valueAsNumber: true })}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password Protection</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="optional password"
                          {...form.register('password')}
                          className="mt-1.5"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createLinkMutation.isPending}
                >
                  {createLinkMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4 mr-2" />
                      Create Short Link
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk URL Processing</CardTitle>
              <CardDescription>process multiple urls at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste URLs here (one per line)&#10;https://example.com/page1&#10;https://example.com/page2"
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                rows={8}
              />
              <Button
                onClick={handleBulkProcess}
                disabled={!bulkInput.trim() || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Process URLs
                  </>
                )}
              </Button>

              {processedLinks.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="font-semibold">Processed Links ({processedLinks.length})</h3>
                  {processedLinks.map((link, idx) => (
                    <URLPreviewCard
                      key={idx}
                      shortUrl={`https://${link.domain}/${link.slug}`}
                      originalUrl={link.destination_url}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Links</CardTitle>
              <CardDescription>your recently created short links</CardDescription>
            </CardHeader>
            <CardContent>
              {recentLinks && recentLinks.length > 0 ? (
                <div className="space-y-3">
                  {recentLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-primary truncate">
                          https://{link.domain}/{link.slug}
                        </p>
                        <p className="text-xs text-secondary-label truncate">
                          {link.destination_url}
                        </p>
                        <p className="text-xs text-tertiary-label mt-1">
                          {link.total_clicks || 0} clicks
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(`https://${link.domain}/${link.slug}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-secondary-label py-8">
                  no links created yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
