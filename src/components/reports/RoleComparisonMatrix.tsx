import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download } from "lucide-react";
import { formatCurrency } from "@/lib/salaryData";

interface RoleData {
  role: string;
  medianSalary: number;
  growthRate: string;
  remoteAvailable: boolean;
  experienceYears: number;
  topSkills: string[];
}

const roles: RoleData[] = [
  { role: "Marketing Manager", medianSalary: 95000, growthRate: "+12%", remoteAvailable: true, experienceYears: 5, topSkills: ["Analytics", "Strategy", "Content"] },
  { role: "Senior Marketing Manager", medianSalary: 127000, growthRate: "+15%", remoteAvailable: true, experienceYears: 8, topSkills: ["Leadership", "Budget", "Analytics"] },
  { role: "Marketing Operations Manager", medianSalary: 105000, growthRate: "+18%", remoteAvailable: true, experienceYears: 6, topSkills: ["Marketing Automation", "CRM", "Analytics"] },
  { role: "Demand Generation Manager", medianSalary: 110000, growthRate: "+16%", remoteAvailable: true, experienceYears: 5, topSkills: ["Campaigns", "Analytics", "ABM"] },
  { role: "Product Marketing Manager", medianSalary: 120000, growthRate: "+14%", remoteAvailable: true, experienceYears: 6, topSkills: ["Positioning", "GTM", "Messaging"] },
  { role: "Content Marketing Manager", medianSalary: 88000, growthRate: "+10%", remoteAvailable: true, experienceYears: 4, topSkills: ["Writing", "SEO", "Strategy"] },
  { role: "Sales Operations Manager", medianSalary: 98000, growthRate: "+13%", remoteAvailable: false, experienceYears: 5, topSkills: ["Salesforce", "Forecasting", "Analytics"] },
  { role: "Revenue Operations Manager", medianSalary: 125000, growthRate: "+20%", remoteAvailable: true, experienceYears: 7, topSkills: ["Revenue Analytics", "Systems", "Strategy"] },
];

type SortKey = "role" | "medianSalary" | "growthRate" | "experienceYears";

export const RoleComparisonMatrix = () => {
  const [sortKey, setSortKey] = useState<SortKey>("medianSalary");
  const [sortDesc, setSortDesc] = useState(true);

  const sortedRoles = [...roles].sort((a, b) => {
    if (sortKey === "growthRate") {
      const aVal = parseInt(a.growthRate);
      const bVal = parseInt(b.growthRate);
      return sortDesc ? bVal - aVal : aVal - bVal;
    }
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }
    return sortDesc ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Role Comparison Matrix</CardTitle>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-deepSea/20">
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("role")}
                    className="flex items-center gap-2 font-semibold text-deepSea hover:text-deepSea/80"
                  >
                    Role <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="text-right p-4">
                  <button
                    onClick={() => handleSort("medianSalary")}
                    className="flex items-center justify-end gap-2 font-semibold text-deepSea hover:text-deepSea/80 w-full"
                  >
                    Median Salary <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="text-center p-4">
                  <button
                    onClick={() => handleSort("growthRate")}
                    className="flex items-center justify-center gap-2 font-semibold text-deepSea hover:text-deepSea/80 w-full"
                  >
                    Growth Rate <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="text-center p-4">
                  <button
                    onClick={() => handleSort("experienceYears")}
                    className="flex items-center justify-center gap-2 font-semibold text-deepSea hover:text-deepSea/80 w-full"
                  >
                    Experience <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="text-center p-4 font-semibold text-deepSea">Remote</th>
                <th className="text-left p-4 font-semibold text-deepSea">Top Skills</th>
              </tr>
            </thead>
            <tbody>
              {sortedRoles.map((role, index) => (
                <tr key={index} className="border-b hover:bg-wildSand/50 transition-colors">
                  <td className="p-4 font-medium">{role.role}</td>
                  <td className="p-4 text-right font-semibold text-blazeOrange">
                    {formatCurrency(role.medianSalary)}
                  </td>
                  <td className="p-4 text-center">
                    <Badge variant="outline" className="border-deepSea text-deepSea">
                      {role.growthRate}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">{role.experienceYears} years</td>
                  <td className="p-4 text-center">
                    {role.remoteAvailable ? (
                      <Badge className="bg-deepSea">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {role.topSkills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
