interface FlowConnectorProps {
  direction?: "horizontal" | "vertical";
}

export const FlowConnector = ({ direction = "horizontal" }: FlowConnectorProps) => {
  if (direction === "horizontal") {
    return (
      <svg
        className="hidden md:block w-12 h-6 text-foreground/20 flex-shrink-0"
        viewBox="0 0 48 24"
        fill="none"
      >
        <path
          d="M0 12 L48 12 M48 12 L42 6 M48 12 L42 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className="w-6 h-12 text-foreground/20 flex-shrink-0"
      viewBox="0 0 24 48"
      fill="none"
    >
      <path
        d="M12 0 L12 48 M12 48 L6 42 M12 48 L18 42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
