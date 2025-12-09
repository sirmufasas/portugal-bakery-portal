import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // capture current path

  if (!isAuthenticated) {
    // Redirect to signup but remember where user wanted to go
    return <Navigate to="/signup" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
