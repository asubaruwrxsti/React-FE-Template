import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/types/Users/User";
import { AuthContextType } from "@/types/App/auth-context";
import { apiClient } from "@/lib/api-client";
import { AppConfig } from "@/lib/app-config";
import { isTokenExpired, refreshAuthToken } from "@/lib/utils/utils";
import { authStorage } from "@/lib/utils/storage-utils";

/**
 * Auth context provides authentication state and methods throughout the application
 * This is a generic implementation that can be used across different applications
 */
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: () => { },
    login: async () => false,
    register: async () => false,
    authFetch: async () => new Response(),
    isAuthenticated: false,
    updateUser: () => { }
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for existing auth session on component mount
        const storedUser = authStorage.getUser<User>();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const logout = () => {
        const accessToken = authStorage.getAccessToken();

        // Only send logout request if we have an access token
        if (accessToken) {
            apiClient(`${AppConfig.apiUrl}/auth/logout`, {
                method: "POST",
            }).catch(err => console.error("Logout error:", err));
        }

        // Clean up local storage and reset state
        authStorage.clearAuth();
        setUser(null);
        navigate("/login");
    };

    const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await apiClient(`${AppConfig.apiUrl}/auth/login`, {
                method: 'POST',
                body: credentials
            });

            if (response && response.data) {
                const { user, accessToken, refreshToken } = response.data;

                // Store auth data
                authStorage.setAccessToken(accessToken);
                authStorage.setRefreshToken(refreshToken);
                authStorage.setUser(user);

                setUser(user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await apiClient(`${AppConfig.apiUrl}/auth/register`, {
                method: 'POST',
                body: userData
            });

            return !!response?.data;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = (userData: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        authStorage.setUser(updatedUser);
    };

    const authFetch = async (url: string, options: any = { headers: {} }) => {
        let accessToken = authStorage.getAccessToken();

        if (accessToken && isTokenExpired(accessToken)) {
            accessToken = await refreshAuthToken();
            if (!accessToken) {
                return new Response(JSON.stringify({ message: "Authentication required" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
        };

        try {
            let response = await fetch(url, { ...options, headers });

            // If we still get 401 despite proactive refresh, try once more
            if (response.status === 401) {
                const newToken = await refreshAuthToken();

                if (newToken) {
                    headers.Authorization = `Bearer ${newToken}`;
                    response = await fetch(url, { ...options, headers });
                }
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        authFetch,
        isAuthenticated: !!user,
        updateUser
    };

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => useContext(AuthContext);