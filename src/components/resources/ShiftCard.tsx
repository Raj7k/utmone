import { LucideIcon } from "lucide-react";

interface ShiftCardProps {
  icon: LucideIcon;
  title: string;
  bullets: string[];
}

export const ShiftCard = ({ icon: Icon, title, bullets }: ShiftCardProps) => {
  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 hover:border-white/30 transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground">{title}</h3>
        <ul className="space-y-2">
          {bullets.map((bullet, index) => (
            <li key={index} className="text-sm text-muted-foreground leading-relaxed">
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};