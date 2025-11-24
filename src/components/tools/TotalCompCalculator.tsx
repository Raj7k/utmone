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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-[hsl(18,100%,51%)]" />
          Total Compensation Calculator
        </CardTitle>
        <CardDescription>
          Calculate true total compensation including all components
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Base Salary</Label>
            <Input type="number" value={base} onChange={(e) => setBase(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label>Annual Bonus</Label>
            <Input type="number" value={bonus} onChange={(e) => setBonus(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label>Signing Bonus</Label>
            <Input type="number" value={signing} onChange={(e) => setSigning(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label>Equity (Annual Value)</Label>
            <Input type="number" value={equity} onChange={(e) => setEquity(parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Benefits & Stipends</Label>
            <Input type="number" value={benefits} onChange={(e) => setBenefits(parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <div className="p-6 bg-[hsl(18,100%,51%)]/10 rounded-xl border-2 border-[hsl(18,100%,51%)]">
          <p className="text-sm text-secondary-label mb-2">Total Compensation (Year 1)</p>
          <p className="text-5xl font-display font-bold text-[hsl(18,100%,51%)]">
            ${totalComp.toLocaleString()}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-secondary-label">Base:</span> <span className="font-semibold">{((base/totalComp)*100).toFixed(1)}%</span></div>
            <div><span className="text-secondary-label">Variable:</span> <span className="font-semibold">{(((bonus+signing+equity)/totalComp)*100).toFixed(1)}%</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
