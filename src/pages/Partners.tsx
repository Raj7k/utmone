import { Navigate } from "react-router-dom";

// Redirect /partners to /partners/apply
const Partners = () => {
  return <Navigate to="/partners/apply" replace />;
};

export default Partners;
