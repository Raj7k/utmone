import { Users } from "lucide-react";

interface FoundingMemberCounterProps {
  total?: number;
  remaining?: number;
}

export const FoundingMemberCounter = ({ 
  total = 100, 
  remaining = 47 
}: FoundingMemberCounterProps) => {
  const taken = total - remaining;
  const percentageTaken = (taken / total) * 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center">
          <span className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping" />
          <span className="relative w-2 h-2 bg-green-500 rounded-full" />
        </div>
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{remaining}</span> of {total} founding member spots left
        </span>
      </div>
      
      <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
          style={{ width: `${percentageTaken}%` }}
        />
      </div>
    </div>
  );
};
