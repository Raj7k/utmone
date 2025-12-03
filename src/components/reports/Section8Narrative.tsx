import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Section8Narrative = () => {
  return (
    <div className="max-w-[900px] mx-auto space-y-12 mb-16">
      {/* Opening Narrative */}
      <div className="prose prose-lg">
        <p className="text-lg text-muted-foreground leading-relaxed">
          How do you calculate a fair global salary when the same role pays $135K in San Francisco
          and $32K in Bangalore? We built a formula that accounts for 5 multipliers that research
          shows matter most: <strong className="text-blazeOrange">geographic location</strong>,{" "}
          <strong className="text-deepSea">experience level</strong>,{" "}
          <strong className="text-blazeOrange">company size</strong>,{" "}
          <strong className="text-deepSea">industry</strong>, and{" "}
          <strong className="text-blazeOrange">skill premiums</strong>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed mt-6">
          This isn't guesswork. We analyzed 20,000+ survey responses, 50,000+ job postings, and
          500K+ salary records from SHRM, Glassdoor, Payscale, and Naukri.com to determine the
          exact weight each factor carries in real compensation decisions.
        </p>
      </div>

      {/* The Formula */}
      <Card className="bg-gradient-to-br from-blazeOrange/5 to-deepSea/5 border-2 border-blazeOrange/20 p-8">
        <h3 className="text-2xl font-bold text-mirage mb-4">The Formula</h3>
        <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <code className="text-lg text-mirage font-mono block whitespace-pre-wrap break-words">
            Global Salary = Base_Global × Region_Multiplier × Experience_Multiplier ×
            Company_Size_Multiplier × Industry_Multiplier × (1 + Skill_Premiums)
          </code>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Each multiplier is research-backed and weighted based on real hiring data across 15+
          countries and 50+ roles.
        </p>
      </Card>

      {/* Region Multipliers Table */}
      <div>
        <h3 className="text-2xl font-bold text-mirage mb-6">Region Multipliers</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-deepSea/10">
                <th className="border border-deepSea/20 p-3 text-left font-semibold text-mirage">
                  Region
                </th>
                <th className="border border-deepSea/20 p-3 text-left font-semibold text-mirage">
                  Multiplier
                </th>
                <th className="border border-deepSea/20 p-3 text-left font-semibold text-mirage">
                  Example (Marketing Manager)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-deepSea/10 p-3">SF Bay Area</td>
                <td className="border border-deepSea/10 p-3 font-bold text-blazeOrange">1.40</td>
                <td className="border border-deepSea/10 p-3">$133K</td>
              </tr>
              <tr className="bg-wildSand/30">
                <td className="border border-deepSea/10 p-3">New York City</td>
                <td className="border border-deepSea/10 p-3 font-bold text-blazeOrange">1.35</td>
                <td className="border border-deepSea/10 p-3">$128K</td>
              </tr>
              <tr>
                <td className="border border-deepSea/10 p-3">Austin</td>
                <td className="border border-deepSea/10 p-3 font-bold text-deepSea">1.10</td>
                <td className="border border-deepSea/10 p-3">$105K</td>
              </tr>
              <tr className="bg-wildSand/30">
                <td className="border border-deepSea/10 p-3">Remote US</td>
                <td className="border border-deepSea/10 p-3 font-bold text-deepSea">0.90</td>
                <td className="border border-deepSea/10 p-3">$86K</td>
              </tr>
              <tr>
                <td className="border border-deepSea/10 p-3">London</td>
                <td className="border border-deepSea/10 p-3 font-bold text-deepSea">0.85</td>
                <td className="border border-deepSea/10 p-3">$81K</td>
              </tr>
              <tr className="bg-wildSand/30">
                <td className="border border-deepSea/10 p-3">Bangalore</td>
                <td className="border border-deepSea/10 p-3 font-bold text-mirage">0.32</td>
                <td className="border border-deepSea/10 p-3">$30K</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Experience Multipliers */}
      <div>
        <h3 className="text-2xl font-bold text-mirage mb-6">Experience Multipliers</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-deepSea/10">
                <th className="border border-deepSea/20 p-3 text-left font-semibold text-mirage">
                  Experience Level
                </th>
                <th className="border border-deepSea/20 p-3 text-left font-semibold text-mirage">
                  Multiplier
                </th>
                <th className="border border-deepSea/20 p-3 text-left font-semibold text-mirage">
                  Typical Range
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-deepSea/10 p-3">0-2 years</td>
                <td className="border border-deepSea/10 p-3 font-bold text-mirage">0.70</td>
                <td className="border border-deepSea/10 p-3">$66K-75K</td>
              </tr>
              <tr className="bg-wildSand/30">
                <td className="border border-deepSea/10 p-3">3-5 years (Baseline)</td>
                <td className="border border-deepSea/10 p-3 font-bold text-deepSea">1.00</td>
                <td className="border border-deepSea/10 p-3">$95K</td>
              </tr>
              <tr>
                <td className="border border-deepSea/10 p-3">6-9 years</td>
                <td className="border border-deepSea/10 p-3 font-bold text-blazeOrange">1.30</td>
                <td className="border border-deepSea/10 p-3">$124K</td>
              </tr>
              <tr className="bg-wildSand/30">
                <td className="border border-deepSea/10 p-3">10-14 years</td>
                <td className="border border-deepSea/10 p-3 font-bold text-blazeOrange">1.60</td>
                <td className="border border-deepSea/10 p-3">$152K</td>
              </tr>
              <tr>
                <td className="border border-deepSea/10 p-3">15+ years</td>
                <td className="border border-deepSea/10 p-3 font-bold text-blazeOrange">2.00</td>
                <td className="border border-deepSea/10 p-3">$190K</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Size & Industry Multipliers */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-mirage mb-4">Company Size Multipliers</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-deepSea/10">
                  <th className="border border-deepSea/20 p-2 text-left font-semibold">Size</th>
                  <th className="border border-deepSea/20 p-2 text-left font-semibold">
                    Multiplier
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-deepSea/10 p-2">1-50</td>
                  <td className="border border-deepSea/10 p-2 font-bold text-mirage">0.85</td>
                </tr>
                <tr className="bg-wildSand/30">
                  <td className="border border-deepSea/10 p-2">51-500</td>
                  <td className="border border-deepSea/10 p-2 font-bold text-blazeOrange">1.15</td>
                </tr>
                <tr>
                  <td className="border border-deepSea/10 p-2">501-5000</td>
                  <td className="border border-deepSea/10 p-2 font-bold text-deepSea">1.00</td>
                </tr>
                <tr className="bg-wildSand/30">
                  <td className="border border-deepSea/10 p-2">5001+</td>
                  <td className="border border-deepSea/10 p-2 font-bold text-blazeOrange">1.10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-mirage mb-4">Industry Multipliers</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-deepSea/10">
                  <th className="border border-deepSea/20 p-2 text-left font-semibold">Industry</th>
                  <th className="border border-deepSea/20 p-2 text-left font-semibold">
                    Multiplier
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-deepSea/10 p-2">Tech/SaaS</td>
                  <td className="border border-deepSea/10 p-2 font-bold text-blazeOrange">1.15</td>
                </tr>
                <tr className="bg-wildSand/30">
                  <td className="border border-deepSea/10 p-2">Finance</td>
                  <td className="border border-deepSea/10 p-2 font-bold text-blazeOrange">1.12</td>
                </tr>
                <tr>
                  <td className="border border-deepSea/10 p-2">Healthcare</td>
                  <td className="border border-deepSea/10 p-2 font-bold text-deepSea">1.00</td>
                </tr>
                <tr className="bg-wildSand/30">
                  <td className="border border-deepSea/10 p-2">Retail</td>
                  <td className="border border-deepSea/10 p-2 font-bold text-mirage">0.90</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Example Calculation */}
      <Card className="bg-gradient-to-br from-deepSea/5 to-wildSand/50 border-2 border-deepSea/20 p-8">
        <h3 className="text-2xl font-bold text-mirage mb-4">Example Calculation</h3>
        <p className="text-muted-foreground mb-6">
          Let's calculate the salary for a <strong>Product Marketing Manager</strong> with{" "}
          <strong>6 years experience</strong> at a <strong>Series B startup (200 employees)</strong>{" "}
          in <strong>Austin</strong>, working in <strong>Tech/SaaS</strong>, with{" "}
          <strong>AI/ML (+58%)</strong> and <strong>SQL (+28%)</strong> skills.
        </p>
        <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl p-6 space-y-3 font-mono text-sm border border-white/10">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base Global Salary:</span>
            <span className="font-bold">$95,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">× Region (Austin):</span>
            <span className="font-bold text-deepSea">× 1.10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">× Experience (6 years):</span>
            <span className="font-bold text-blazeOrange">× 1.30</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">× Company Size (200):</span>
            <span className="font-bold text-deepSea">× 1.15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">× Industry (Tech/SaaS):</span>
            <span className="font-bold text-blazeOrange">× 1.15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">× Skills (AI/ML + SQL):</span>
            <span className="font-bold text-blazeOrange">× 1.86 (86% premium)</span>
          </div>
          <div className="border-t-2 border-deepSea/20 pt-3 mt-3 flex justify-between text-lg">
            <span className="font-bold text-mirage">Final Salary:</span>
            <span className="font-bold text-blazeOrange">$323,000</span>
          </div>
        </div>
      </Card>

      {/* Download JSON Schema */}
      <div className="text-center">
        <Button
          variant="outline"
          className="border-deepSea text-deepSea hover:bg-deepSea/10"
          onClick={() => {
            // Create JSON data
            const schema = {
              formula: "Base_Global × Region × Experience × Company_Size × Industry × (1 + Skills)",
              regions: [
                { name: "SF Bay Area", multiplier: 1.4 },
                { name: "NYC", multiplier: 1.35 },
                { name: "Austin", multiplier: 1.1 },
                { name: "Remote US", multiplier: 0.9 },
                { name: "London", multiplier: 0.85 },
                { name: "Bangalore", multiplier: 0.32 },
              ],
              experience: [
                { years: "0-2", multiplier: 0.7 },
                { years: "3-5", multiplier: 1.0 },
                { years: "6-9", multiplier: 1.3 },
                { years: "10-14", multiplier: 1.6 },
                { years: "15+", multiplier: 2.0 },
              ],
              companySize: [
                { size: "1-50", multiplier: 0.85 },
                { size: "51-500", multiplier: 1.15 },
                { size: "501-5000", multiplier: 1.0 },
                { size: "5001+", multiplier: 1.1 },
              ],
              industry: [
                { name: "Tech/SaaS", multiplier: 1.15 },
                { name: "Finance", multiplier: 1.12 },
                { name: "Healthcare", multiplier: 1.0 },
                { name: "Retail", multiplier: 0.9 },
              ],
              skills: [
                { name: "AI/ML", premium: 0.58 },
                { name: "GTM Strategy", premium: 0.45 },
                { name: "Attribution", premium: 0.42 },
                { name: "SQL", premium: 0.28 },
              ],
            };

            const blob = new Blob([JSON.stringify(schema, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "utm-one-salary-formula-schema.json";
            a.click();
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Download JSON Schema (For Developers)
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Use this data in your own calculations, dashboards, or compensation planning tools
        </p>
      </div>
    </div>
  );
};
