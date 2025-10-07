import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string; // optional redirect for auth pages
}

const ProtectedRoute = ({ children, redirectTo = "/" }: ProtectedRouteProps) => {
  const token = localStorage.getItem("access_token");
  const location = useLocation();

  // If user is logged in and tries to access auth pages, redirect to protected page
  if (token && location.pathname.startsWith("/auth")) {
    return <Navigate to={redirectTo} replace />;
  }

  // If user is NOT logged in and tries to access protected pages, redirect to login
  if (!token && !location.pathname.startsWith("/auth")) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Otherwise render children
  return <>{children}</>;
};

export default ProtectedRoute;
