import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "System Admin" | "Business Owner"; // Add role-based protection
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isLoggedIn, user } = useAuth();
  // console.log("isLoggedIn,",isLoggedIn);
  // console.log("user",user);
  // Add debug logging
  // useEffect(() => {
  //   console.log("Auth state - Logged In:", isLoggedIn);
  //   console.log("Current user:", user);
  // }, [isLoggedIn, user]);

  if (!isLoggedIn || !user) {
    console.warn("Redirecting to login: User not authenticated");
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.warn(`Redirecting: User lacks ${requiredRole} role`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;