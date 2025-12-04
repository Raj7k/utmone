import { Link } from "react-router-dom";

export const SkipToContent = () => {
  return (
    <Link
      to="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      style={{ 
        background: 'rgba(255,255,255,0.9)', 
        color: 'rgba(24,24,27,0.9)' 
      }}
      aria-label="Skip to main content"
    >
      Skip to main content
    </Link>
  );
};
