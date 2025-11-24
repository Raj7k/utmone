import * as React from "react";
import { cn } from "@/lib/utils";

export interface GroupedListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const GroupedList = React.forwardRef<HTMLDivElement, GroupedListProps>(
  ({ className, children, ...props }, ref) => (
    <div 
      ref={ref}
      className={cn("bg-grouped-background rounded-xl overflow-hidden", className)} 
      {...props}
    >
      {children}
    </div>
  )
);
GroupedList.displayName = "GroupedList";

export interface GroupedListItemProps extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  asChild?: boolean;
}

export const GroupedListItem = React.forwardRef<HTMLElement, GroupedListItemProps>(
  ({ className, children, href, onClick, ...props }, ref) => {
    const Component = href ? "a" : "div";
    
    return (
      <Component
        ref={ref as any}
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center bg-secondary-grouped-background px-4 py-3.5 min-h-[44px] border-b border-separator last:border-0 transition-apple",
          (href || onClick) && "hover:bg-fill-tertiary cursor-pointer",
          className
        )}
        role={onClick && !href ? "button" : undefined}
        tabIndex={onClick && !href ? 0 : undefined}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
GroupedListItem.displayName = "GroupedListItem";
