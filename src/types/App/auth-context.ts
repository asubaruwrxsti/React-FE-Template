import { User } from "../Users/User";

/**
 * Authentication context type definition
 * This defines the interface for the auth context
 */
export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (credentials: { email: string; password: string }) => Promise<boolean>;
    register: (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => Promise<boolean>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    authFetch: (url: string, options?: any) => Promise<Response>;
}