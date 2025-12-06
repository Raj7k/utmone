import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Handshake, Printer, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SLAgreementCard = () => {
  const { toast } = useToast();

  const marketingPromises = [
    { id: "m1", text: "Deliver 100+ leads per month (MQL threshold: 30+ points)" },
    { id: "m2", text: "Respond to sales feedback within 24 hours" },
    { id: "m3", text: "Provide lead context in CRM (campaign, content, score)" },
    { id: "m4", text: "Maintain MQL-to-SQL rate above 10%" },
    { id: "m5", text: "Attend weekly Tuesday sync (15 min)" },
    { id: "m6", text: "Adjust scoring monthly based on win/loss data" },
  ];

  const salesPromises = [
    { id: "s1", text: "Contact all MQLs within 1 hour (max 2 hours)" },
    { id: "s2", text: "Log all calls/emails in CRM within 24 hours" },
    { id: "s3", text: "Provide feedback on lead quality weekly" },
    { id: "s4", text: "Mark SQL status within 48 hours of first contact" },
    { id: "s5", text: "Attend weekly Tuesday sync (15 min)" },
  ];

  const handlePrint = () => {
    window.print();
    toast({ title: "opening print dialog", description: "prepare your SLA for signatures" });
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Sales & Marketing SLA Agreement");
    const body = encodeURIComponent(`
Sales & Marketing Alignment SLA

Marketing's Promises:
${marketingPromises.map((p, i) => `${i + 1}. ${p.text}`).join('\n')}

Sales' Promises:
${salesPromises.map((p, i) => `${i + 1}. ${p.text}`).join('\n')}

Signatures:
Marketing Leader: ___________________ Date: _______
Sales Leader: ___________________ Date: _______

Once signed, post this in both team channels.
    `.trim());
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Card className="my-8 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Handshake className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">The SLA (Handshake Agreement)</CardTitle>
              <CardDescription>print it. sign it. put it on the wall.</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleEmail} variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Email to Team
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Marketing Promises */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default" className="text-sm">Marketing</Badge>
              <h3 className="font-semibold text-lg">6 Promises to Sales</h3>
            </div>
            <div className="space-y-3">
              {marketingPromises.map((promise, index) => (
                <div key={promise.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Checkbox id={promise.id} />
                  <label htmlFor={promise.id} className="text-sm leading-relaxed cursor-pointer flex-1">
                    <span className="font-semibold text-primary">{index + 1}.</span> {promise.text}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Promises */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">Sales</Badge>
              <h3 className="font-semibold text-lg">5 Promises to Marketing</h3>
            </div>
            <div className="space-y-3">
              {salesPromises.map((promise, index) => (
                <div key={promise.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Checkbox id={promise.id} />
                  <label htmlFor={promise.id} className="text-sm leading-relaxed cursor-pointer flex-1">
                    <span className="font-semibold text-primary">{index + 1}.</span> {promise.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mt-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Marketing Leader</p>
              <div className="h-12 border-b-2 border-foreground/20"></div>
              <p className="text-xs text-muted-foreground">Signature</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Sales Leader</p>
              <div className="h-12 border-b-2 border-foreground/20"></div>
              <p className="text-xs text-muted-foreground">Signature</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <div className="h-12 border-b-2 border-foreground/20"></div>
              <p className="text-xs text-muted-foreground">MM / DD / YYYY</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl border bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Why this matters:</strong> A signed SLA creates accountability. When both teams commit publicly to these promises, execution improves by 3-5x. Post this in Slack after signing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};