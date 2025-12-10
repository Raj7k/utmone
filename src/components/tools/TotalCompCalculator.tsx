import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

export const TotalCompCalculator = () => {
  const [base, setBase] = useState(100000);
  const [bonus, setBonus] = useState(10000);
  const [signing, setSigning] = useState(0);
  const [equity, setEquity] = useState(0);
  const [benefits, setBenefits] = useState(5000);

  const totalComp = base + bonus + signing + equity + benefits;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary" />
          total compensation calculator
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          calculate true total compensation including all components
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>base salary</Label>
            <Input type="number" value={base} onChange={(e) => setBase(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label>annual bonus</Label>
            <Input type="number" value={bonus} onChange={(e) => setBonus(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label>signing bonus</Label>
            <Input type="number" value={signing} onChange={(e) => setSigning(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label>equity (annual value)</Label>
            <Input type="number" value={equity} onChange={(e) => setEquity(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>benefits & stipends</Label>
            <Input type="number" value={benefits} onChange={(e) => setBenefits(parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <div className="p-6 bg-primary/10 rounded-xl border-2 border-primary">
          <p className="text-sm text-muted-foreground mb-2">total compensation (year 1)</p>
          <p className="text-5xl font-display font-bold text-primary">
            ${totalComp.toLocaleString()}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">base:</span> <span className="font-semibold">{((base/totalComp)*100).toFixed(1)}%</span></div>
            <div><span className="text-muted-foreground">variable:</span> <span className="font-semibold">{(((bonus+signing+equity)/totalComp)*100).toFixed(1)}%</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
