import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export const Privado = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/ingreso" />;
    }
    return children;
}