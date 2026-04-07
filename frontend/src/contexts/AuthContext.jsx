// contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api.js';
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authChecking = async () => {
            if (token) {
                authService.getProfile()
                    .then(data => setUser(data.user))
                    .catch(() => {
                        localStorage.removeItem('token');
                        setToken(null);
                    })
                    .finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        }
        authChecking();
    }, [token]);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    };
    const register = async (userData) => {
        const data = await authService.register(userData);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    };
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{
            user, token, loading, isAuthenticated: !!user,
            login, register, logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}