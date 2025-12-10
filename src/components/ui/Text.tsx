import { formatText, preserveAcronyms } from "@/utils/textFormatter";
import { cn } from "@/lib/utils";
import { useEffect, useState, ReactNode, Children, isValidElement, cloneElement } from "react";

interface TextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'div';
  className?: string;
  forceMode?: 'minimal' | 'grammar';
  preserveOnly?: boolean; // Only preserve acronyms without mode formatting
}

// Recursively process children to preserve acronyms in all text nodes
function processChildren(children: ReactNode, forceMode?: 'minimal' | 'grammar', preserveOnly?: boolean): ReactNode {
  return Children.map(children, child => {
    if (typeof child === 'string') {
      return preserveOnly ? preserveAcronyms(child) : formatText(child, forceMode);
    }
    if (typeof child === 'number') {
      return child;
    }
    if (isValidElement(child) && child.props.children) {
      return cloneElement(child, {
        ...child.props,
        children: processChildren(child.props.children, forceMode, preserveOnly)
      });
    }
    return child;
  });
}

export const Text = ({ 
  children, 
  as: Tag = 'span', 
  className,
  forceMode,
  preserveOnly = false
}: TextProps) => {
  const [processedChildren, setProcessedChildren] = useState<ReactNode>(() => 
    processChildren(children, forceMode, preserveOnly)
  );
  
  // Listen for text mode changes
  useEffect(() => {
    const handleModeChange = () => {
      setProcessedChildren(processChildren(children, forceMode, preserveOnly));
    };
    
    // Initial processing
    handleModeChange();
    
    window.addEventListener('text-mode-change', handleModeChange);
    window.addEventListener('storage', handleModeChange);
    
    return () => {
      window.removeEventListener('text-mode-change', handleModeChange);
      window.removeEventListener('storage', handleModeChange);
    };
  }, [children, forceMode, preserveOnly]);

  return <Tag className={cn(className)}>{processedChildren}</Tag>;
};

// Export preserveAcronyms for direct use in components
export { preserveAcronyms } from "@/utils/textFormatter";
