import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth.jsx";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/" />;

  return children;
}