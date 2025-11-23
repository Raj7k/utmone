interface QuickAnswerProps {
  children: React.ReactNode;
}

export const QuickAnswer = ({ children }: QuickAnswerProps) => {
  return (
    <div className="p-6 bg-primary/5 border-l-4 border-primary rounded-r-xl mb-12">
      <h3 className="text-lg font-semibold mb-2">Quick Answer</h3>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
};
