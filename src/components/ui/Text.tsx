import { formatText } from "@/utils/textFormatter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TextProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
  className?: string;
  forceMode?: 'minimal' | 'grammar';
}

export const Text = ({ 
  children, 
  as: Tag = 'span', 
  className,
  forceMode 
}: TextProps) => {
  const [formattedText, setFormattedText] = useState(formatText(children, forceMode));
  
  // Listen for text mode changes
  useEffect(() => {
    const handleModeChange = () => {
      setFormattedText(formatText(children, forceMode));
    };
    
    window.addEventListener('text-mode-change', handleModeChange);
    window.addEventListener('storage', handleModeChange);
    
    return () => {
      window.removeEventListener('text-mode-change', handleModeChange);
      window.removeEventListener('storage', handleModeChange);
    };
  }, [children, forceMode]);

  return <Tag className={cn(className)}>{formattedText}</Tag>;
};
