import { useIntersectionAnimation } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

interface UseCase {
  title: string;
  scenario: string;
  solution: string;
}

interface UseCasesGridProps {
  useCases: UseCase[];
}

export const UseCasesGrid = ({ useCases }: UseCasesGridProps) => {
  const { ref, isVisible } = useIntersectionAnimation(0.1);

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-6">
      {useCases.map((useCase, index) => (
        <div
          key={index}
          className={cn(
            "obsidian-glass rounded-xl p-6 transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <h3 className="text-lg font-display font-bold mb-3 text-white">
            {useCase.title}
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wide font-semibold mb-1 text-destructive">
                Problem
              </div>
              <p className="text-sm text-white/60 font-sans">{useCase.scenario}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide font-semibold mb-1 text-white/70">
                Solution
              </div>
              <p className="text-sm font-medium text-white font-sans">{useCase.solution}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
