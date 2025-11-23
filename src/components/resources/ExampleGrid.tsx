import { ReactNode } from "react";

interface ExampleGridProps {
  children: ReactNode;
}

export const ExampleGrid = ({ children }: ExampleGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {children}
    </div>
  );
};
