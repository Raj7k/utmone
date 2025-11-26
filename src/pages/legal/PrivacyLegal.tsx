import { Navigate } from "react-router-dom";

// Redirect to existing privacy policy page
const PrivacyLegal = () => {
  return <Navigate to="/privacy-policy" replace />;
};

export default PrivacyLegal;
