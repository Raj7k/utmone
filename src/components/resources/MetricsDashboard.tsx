import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Minus, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Metric {
  name: string;
  value: number;
  threshold: number;
  isBelow: boolean;
  unit: string;
  description: string;
}

export const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    { name: "Lead Volume", value: 150, threshold: 120, isBelow: false, unit: "leads", description: "Total leads this month" },
    { name: "MQL Rate", value: 12, threshold: 8, isBelow: false, unit: "%", description: "% of leads qualified" },
    { name: "MQL-to-SQL Rate", value: 15, threshold: 10, isBelow: false, unit: "%", description: "Quality of handoff" },
    { name: "Response Time", value: 1.5, threshold: 2, isBelow: true, unit: "hours", description: "Avg time to contact" },
    { name: "Sales Cycle", value: 35, threshold: 45, isBelow: true, unit: "days", description: "Avg days to close" },
    { name: "Win Rate", value: 25, threshold: 20, isBelow: false, unit: "%", description: "% of deals won" },
    { name: "Monthly Pipeline", value: 450000, threshold: 300000, isBelow: false, unit: "$", description: "Revenue potential" },
  ]);

  const healthyCount = metrics.filter(m => 
    m.isBelow ? m.value <= m.threshold : m.value >= m.threshold
  ).length;

  const healthPercentage = (healthyCount / metrics.length) * 100;

  const updateMetric = (index: number, value: number) => {
    const newMetrics = [...metrics];
    newMetrics[index].value = value;
    setMetrics(newMetrics);
  };

  const isHealthy = (metric: Metric) => {
    return metric.isBelow ? metric.value <= metric.threshold : metric.value >= metric.threshold;
  };

  const formatValue = (metric: Metric) => {
    if (metric.unit === "$") {
      return `$${(metric.value / 1000).toFixed(0)}K`;
    }
    return `${metric.value}${metric.unit}`;
  };

  const exportReport = () => {
    const report = metrics.map(m => ({
      metric: m.name,
      current: m.value,
      target: m.threshold,
      status: isHealthy(m) ? "Healthy" : "Needs Attention"
    }));
    const csv = [
      "Metric,Current Value,Target,Status",
      ...report.map(r => `${r.metric},${r.current},${r.target},${r.status}`)
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "metrics-report.csv";
    a.click();
  };

  return (
    <Card className="my-8 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl">The 7 Sacred Metrics Dashboard</CardTitle>
            <CardDescription>track your sales & marketing health in real-time</CardDescription>
          </div>
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border" style={{ background: 'linear-gradient(to bottom right, rgba(59,130,246,0.05), rgba(59,130,246,0.1))', borderColor: 'rgba(59,130,246,0.2)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Overall Health</p>
              <p className="text-4xl font-bold text-foreground">
                {healthyCount} <span className="text-xl text-muted-foreground">of 7</span>
              </p>
            </div>
            <div className="text-right">
              <Badge variant={healthPercentage >= 70 ? "default" : healthPercentage >= 50 ? "secondary" : "destructive"} className="text-base px-4 py-2">
                {healthPercentage.toFixed(0)}% Healthy
              </Badge>
            </div>
          </div>
          <Progress value={healthPercentage} className="h-3" />
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4">
          {metrics.map((metric, index) => {
            const healthy = isHealthy(metric);
            return (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  healthy ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {healthy ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                      <h4 className="font-semibold text-foreground">{metric.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Current:</span>
                        <Input
                          type="number"
                          value={metric.value}
                          onChange={(e) => updateMetric(index, parseFloat(e.target.value) || 0)}
                          className="w-24 h-8 text-sm"
                          step={metric.unit === "$" ? "1000" : "0.1"}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Target:</span>
                        <Badge variant="outline" className="font-mono">
                          {metric.isBelow ? "≤" : "≥"} {metric.threshold}{metric.unit}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{formatValue(metric)}</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {healthy ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-xs font-medium ${healthy ? "text-green-600" : "text-red-600"}`}>
                        {healthy ? "Healthy" : "Needs Attention"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-muted/20 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Pro tip:</strong> If all 7 metrics are green, you're winning. If any turns red, you know exactly what to fix. Update the values above to see how your team is performing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
