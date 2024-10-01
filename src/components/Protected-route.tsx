import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

interface ProtectedRoutePros {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRoutePros) {
  const user = auth.currentUser;
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}
