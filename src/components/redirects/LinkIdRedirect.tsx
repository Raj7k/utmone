import { Navigate, useParams } from "react-router-dom";

export const LinkIdRedirect = () => {
  const { linkId } = useParams();
  return <Navigate to={`/dashboard/links/${linkId}`} replace />;
};
