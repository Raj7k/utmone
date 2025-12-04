import { MainLayout } from "@/components/layout/MainLayout";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const services = [
  {
    name: 'Redirect Service',
    status: 'operational',
    uptime: '99.98%',
    latency: '42ms',
    description: 'Short link redirects and routing'
  },
  {
    name: 'API',
    status: 'operational',
    uptime: '99.97%',
    latency: '127ms',
    description: 'REST API for link management'
  },
  {
    name: 'Dashboard',
    status: 'operational',
    uptime: '99.99%',
    latency: '310ms',
    description: 'Web application interface'
  },
  {
    name: 'Analytics',
    status: 'operational',
    uptime: '99.96%',
    latency: '240ms',
    description: 'Click tracking and reporting'
  }
];

const incidents = [
  {
    date: '2025-11-28',
    title: 'Elevated API latency',
    status: 'resolved',
    duration: '12 minutes',
    description: 'Temporary spike in API response times due to database connection pool saturation. Resolved by increasing pool size.'
  }
];

export default function Status() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case 'degraded': return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'down': return <XCircle className="h-5 w-5 text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'degraded': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'down': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return '';
    }
  };

  return (
    <MainLayout showAnnouncement={false}>
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-500/30">
            All Systems Operational
          </Badge>
          <h1 className="text-5xl md:text-6xl font-display font-bold hero-gradient mb-6 brand-lowercase">
            system status
          </h1>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Real-time monitoring of utm.one infrastructure and services.
          </p>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-display font-bold text-white mb-8 brand-lowercase">
            service health
          </h2>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.name} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="font-semibold text-white">
                        {service.name}
                      </h3>
                      <p className="text-sm text-white/60">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-white/40">Uptime</p>
                      <p className="font-semibold text-white">{service.uptime}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/40">Latency</p>
                      <p className="font-semibold text-white">{service.latency}</p>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incident History */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-display font-bold text-white mb-8 brand-lowercase">
            incident history
          </h2>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <div key={index} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {incident.title}
                    </h3>
                    <p className="text-sm text-white/60">
                      {incident.date} • Duration: {incident.duration}
                    </p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {incident.status}
                  </Badge>
                </div>
                <p className="text-sm text-white/60">
                  {incident.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4 brand-lowercase">
            subscribe to updates
          </h2>
          <p className="text-white/60 mb-8">
            Get notified when incidents occur or system status changes.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
            <Button variant="default">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-white/40 mt-4">
            We'll only email you about incidents and maintenance windows.
          </p>
        </div>
      </section>
    </MainLayout>
  );
}