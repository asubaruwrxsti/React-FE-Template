import { ReactNode } from 'react';
import { AuthContextType } from '@/types/auth-context';
import { User } from '@/types/User';

// Mock user data
export const mockUser: User = {
    id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    isActive: true,
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    personal: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
    }
};

// Mock authentication context
export const mockAuthContext: AuthContextType = {
    user: mockUser,
    loading: false,
    isAuthenticated: true,
    login: vi.fn().mockResolvedValue(true),
    register: vi.fn().mockResolvedValue(true),
    logout: vi.fn(),
    authFetch: vi.fn().mockResolvedValue(new Response()),
    updateUser: vi.fn()
};

// Create a mock for unauthenticated state
export const mockUnauthContext: AuthContextType = {
    ...mockAuthContext,
    user: null,
    isAuthenticated: false,
    loading: false
};

// Mock loading state
export const mockLoadingAuthContext: AuthContextType = {
    ...mockUnauthContext,
    loading: true
};

// Create a mock AuthContext provider for testing
import * as AuthContextModule from '@/contexts/auth-context';

// Create a mock provider for testing components that use the auth context
export const MockAuthProvider = ({
    children,
    authValue = mockAuthContext
}: {
    children: ReactNode;
    authValue?: AuthContextType
}) => {
    const useAuthSpy = vi.spyOn(AuthContextModule, 'useAuth');
    useAuthSpy.mockReturnValue(authValue);

    return <>{children}</>;
};
