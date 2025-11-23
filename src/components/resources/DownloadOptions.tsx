import { Download, FileText, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DownloadOption {
  label: string;
  format: string;
  icon: typeof Download;
  href?: string;
  onClick?: () => void;
}

interface DownloadOptionsProps {
  title: string;
  options: DownloadOption[];
  className?: string;
}

export const DownloadOptions = ({ title, options, className }: DownloadOptionsProps) => {
  return (
    <div className={cn("my-8 rounded-xl border border-border/50 bg-card p-6", className)}>
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option, index) => {
          const Icon = option.icon;
          
          return (
            <Button
              key={index}
              variant="outline"
              className="justify-start gap-3 h-auto py-3 px-4"
              onClick={option.onClick}
              asChild={!!option.href}
            >
              {option.href ? (
                <a href={option.href} target="_blank" rel="noopener noreferrer">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.format}</span>
                  </div>
                </a>
              ) : (
                <>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.format}</span>
                  </div>
                </>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
