import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    // Redirect to home if not logged in
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
