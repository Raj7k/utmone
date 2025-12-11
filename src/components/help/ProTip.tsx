import { Lightbulb } from "lucide-react";
import { ReactNode } from "react";

interface ProTipProps {
  children: ReactNode;
  title?: string;
}

export const ProTip = ({ children, title = "pro tip" }: ProTipProps) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <Lightbulb className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="text-sm text-amber-800">{children}</div>
        </div>
      </div>
    </div>
  );
};
