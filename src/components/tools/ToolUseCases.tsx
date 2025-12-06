import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface UseCase {
  icon: LucideIcon;
  title: string;
  description: string;
  example: string;
}

interface ToolUseCasesProps {
  title?: string;
  subtitle?: string;
  useCases: UseCase[];
}

export const ToolUseCases = ({ 
  title = "who it's for",
  subtitle = "real use cases from teams using utm.one every day.",
  useCases 
}: ToolUseCasesProps) => {
  return (
    <section className="py-24 md:py-32 bg-muted/20">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-body text-secondary-label max-w-[640px] mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-sm text-secondary-label mb-3">
                      {useCase.description}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      "{useCase.example}"
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
