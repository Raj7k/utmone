import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight, Link as LinkIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FloatingActionButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show FAB after scrolling 300px
      setIsVisible(window.scrollY > 300);
      
      // Auto-collapse when scrolling
      if (window.scrollY > 300 && isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExpanded]);

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-[100px] scale-80 pointer-events-none'
      }`}
    >
      {/* Expanded Quick Actions */}
      <div
        className={`flex flex-col gap-2 mb-2 transition-all duration-300 ${
          isExpanded 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-5 scale-80 pointer-events-none'
        }`}
      >
        {/* Create Link Action */}
        <Link to="/auth">
          <Button
            size="sm"
            className="bg-zinc-900/80 backdrop-blur-xl text-white border border-white-10 hover:bg-zinc-800/80 hover:scale-105 hover:-translate-x-1.5 active:scale-95 shadow-lg rounded-full pl-4 pr-5 h-11 font-medium transition-all duration-200"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            create link
          </Button>
        </Link>

        {/* Get Started Action */}
        <Link to="/early-access">
          <Button
            size="sm"
            className="bg-zinc-900/80 backdrop-blur-xl text-white border border-white-10 hover:bg-zinc-800/80 hover:scale-105 hover:-translate-x-1.5 active:scale-95 shadow-lg rounded-full pl-4 pr-5 h-11 font-medium transition-all duration-200"
          >
            <Zap className="h-4 w-4 mr-2" />
            get started
          </Button>
        </Link>
      </div>

      {/* Main FAB Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative group hover:scale-110 active:scale-90 transition-transform duration-200"
      >
        {/* Pulsing glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl bg-foreground animate-fab-pulse"
        />

        {/* Main button */}
        <div className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors bg-foreground">
          <div
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}
          >
            {isExpanded ? (
              <Plus className="h-6 w-6 text-background" />
            ) : (
              <ArrowRight className="h-6 w-6 text-background" />
            )}
          </div>
        </div>
      </button>

      {/* Tooltip on hover (when collapsed) */}
      {!isVisible || isExpanded ? null : (
        <div
          className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200"
        >
          <div className="bg-foreground text-background text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
            quick actions
          </div>
        </div>
      )}
    </div>
  );
};
