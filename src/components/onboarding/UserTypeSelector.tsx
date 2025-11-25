import { Card, CardContent } from "@/components/ui/card";
import { User, Building2 } from "lucide-react";

interface UserTypeSelectorProps {
  onSelect: (type: "individual" | "organization") => void;
}

export function UserTypeSelector({ onSelect }: UserTypeSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card 
        variant="grouped"
        className="cursor-pointer hover:border-system-blue transition-colors group"
        onClick={() => onSelect("individual")}
      >
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-system-blue/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-system-blue/20 transition-colors">
            <User className="w-8 h-8 text-system-blue" />
          </div>
          <h3 className="text-title-3 text-label mb-2">individual</h3>
          <p className="text-body-apple text-secondary-label">
            personal projects, freelancer, or creator
          </p>
        </CardContent>
      </Card>

      <Card 
        variant="grouped"
        className="cursor-pointer hover:border-system-blue transition-colors group"
        onClick={() => onSelect("organization")}
      >
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-system-blue/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-system-blue/20 transition-colors">
            <Building2 className="w-8 h-8 text-system-blue" />
          </div>
          <h3 className="text-title-3 text-label mb-2">organization</h3>
          <p className="text-body-apple text-secondary-label">
            team or company with multiple members
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
