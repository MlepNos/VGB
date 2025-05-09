// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/authContext";

const ProtectedRoute = ({ children }) => {
  const { authUser } = useAuth();
  return authUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
