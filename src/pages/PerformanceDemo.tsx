import { SmartImage, SmartPicture } from '@/components/ui/smart-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Zap, Network, Image as ImageIcon, Gauge } from 'lucide-react';

/**
 * Performance Demo Page
 * 
 * Demonstrates the algorithmic performance optimizations implemented:
 * - Markovian Prefetching (hover-based predictive loading)
 * - Pareto-Optimal Media Loading (network-aware image serving)
 * - SmartImage component usage examples
 */
export default function PerformanceDemo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-display font-bold">
            Algorithmic Performance
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Based on <em>Algorithms for Optimization</em> and <em>Algorithms for Decision Making</em>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Markovian Prefetching */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <Zap className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.8)' }} />
                </div>
                <div>
                  <CardTitle>Markovian Prefetching</CardTitle>
                  <CardDescription>Predictive page loading</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Hover over these links for 50ms and the page will prefetch in the background.
                When you click, it loads instantly (0ms perceived latency).
              </p>
              <div className="space-y-2">
                <Link 
                  to="/features/short-links" 
                  className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  Short Links →
                </Link>
                <Link 
                  to="/features/utm-builder" 
                  className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  UTM Builder →
                </Link>
                <Link 
                  to="/features/qr-generator" 
                  className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  QR Generator →
                </Link>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <strong>Try it:</strong> Hover each link slowly, then click. Notice the instant load?
              </p>
            </CardContent>
          </Card>

          {/* Pareto Image Loading */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Network className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <CardTitle>Network-Aware Loading</CardTitle>
                  <CardDescription>Pareto-optimal media serving</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Images automatically select optimal quality based on your network connection
                and device size, finding the efficient frontier between quality and bandwidth.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>4G/WiFi: High-quality WebP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>3G: Optimized mobile images</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>2G/Save-Data: Minimal bandwidth</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SmartImage Examples */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold mb-2">SmartImage Examples</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              All images below use adaptive quality and blur-up placeholders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Example 1: Standard SmartImage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Standard SmartImage</CardTitle>
              </CardHeader>
              <CardContent>
                <SmartImage
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
                  mobileSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
                  alt="Analytics dashboard"
                  aspectRatio="16/9"
                  className="rounded-lg"
                />
                <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Serves different image sizes based on device
                </p>
              </CardContent>
            </Card>

            {/* Example 2: With Blur Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">With Blur Placeholder</CardTitle>
              </CardHeader>
              <CardContent>
                <SmartImage
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
                  mobileSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR"
                  alt="Business growth chart"
                  aspectRatio="16/9"
                  className="rounded-lg"
                />
                <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Instant render with blur-up transition
                </p>
              </CardContent>
            </Card>

            {/* Example 3: SmartPicture with Art Direction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SmartPicture</CardTitle>
              </CardHeader>
              <CardContent>
                <SmartPicture
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800"
                  mobileSrc="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400"
                  alt="Team collaboration"
                  className="rounded-lg"
                />
                <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Uses &lt;picture&gt; element for art direction
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Metrics */}
        <Card className="bg-zinc-900/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <Gauge className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.8)' }} />
              </div>
              <div>
                <CardTitle>Performance Targets</CardTitle>
                <CardDescription>Based on Lighthouse Core Web Vitals</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>&lt; 0.8s</div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>First Contentful Paint</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>&lt; 1.2s</div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Largest Contentful Paint</div>
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>= 0</div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Cumulative Layout Shift</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Link */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/docs/performance">
              Read Full Documentation →
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
