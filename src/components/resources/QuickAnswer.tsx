interface QuickAnswerProps {
  children: React.ReactNode;
}

export const QuickAnswer = ({ children }: QuickAnswerProps) => {
  return (
    <div className="p-6 rounded-r-xl mb-12" style={{ background: 'rgba(59,130,246,0.05)', borderLeft: '4px solid rgba(59,130,246,1)' }}>
      <h3 className="text-lg font-semibold mb-2">Quick Answer</h3>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
};
