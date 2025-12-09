import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Attribution page now redirects to Analytics with attribution tab.
 * This maintains backwards compatibility for existing links.
 */
const Attribution = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Preserve any hash or additional params
    navigate(`/dashboard/analytics?tab=attribution${location.search.replace('?', '&')}`, { replace: true });
  }, [navigate, location.search]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">redirecting to intelligence hub…</p>
      </div>
    </div>
  );
};

export default Attribution;
