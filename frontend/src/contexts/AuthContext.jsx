import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/auth.service";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
            checkAuth();
        }
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login({ email, password });
            setToken(data.token);

            // Fetch profile right after login to get user details
            const profileData = await authService.getPerfil();
            setUser(profileData.usuario);

            return { success: true };
        } catch (error) {
            console.error("Error en login:", error.message);
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
    };

    const checkAuth = async () => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            try {
                const data = await authService.getPerfil();
                setUser(data.usuario);
                setToken(storedToken);
            } catch (error) {
                console.error("Sesión inválida:", error.message);
                logout();
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};