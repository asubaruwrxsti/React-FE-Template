import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { authStorage } from '@/lib/utils/storage-utils';
import '@testing-library/jest-dom';

// Mock the dependencies
vi.mock('@/lib/api-client');
vi.mock('@/lib/utils/storage-utils', () => ({
    authStorage: {
        setAccessToken: vi.fn(),
        setRefreshToken: vi.fn(),
        clearAuth: vi.fn(),
        setUser: vi.fn(),
        getUser: vi.fn(),
        getAccessToken: vi.fn(),
        getRefreshToken: vi.fn(),
    }
}));

// A test component that uses the auth context
const TestAuthComponent = () => {
    const { user, login, logout, isAuthenticated, loading } = useAuth();
    return (
        <div>
            {loading ? <p>Loading...</p> : null}
            {isAuthenticated ? <p>Authenticated</p> : <p>Not Authenticated</p>}
            {user ? <p>Username: {user.username}</p> : null}
            <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    // Create a wrapper component with the AuthProvider and Router
    const renderWithAuthProvider = () => {
        return render(
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<TestAuthComponent />} />
                        <Route path="/dashboard" element={<div>Dashboard</div>} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();

        // Set up mock implementations
        vi.mocked(authStorage.getUser).mockReturnValue(null);
        vi.mocked(authStorage.getAccessToken).mockReturnValue(null);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should start with loading state', async () => {
        // Arrange & Act
        renderWithAuthProvider();

        // Assert - it should initially show loading
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        // Then it should show not authenticated once loaded
        await waitFor(() => {
            expect(screen.getByText(/not authenticated/i)).toBeInTheDocument();
        });
    });

    it('should handle login correctly', async () => {
        // Arrange
        const mockUser = {
            id: 'user123',
            username: 'testuser',
            email: 'test@example.com',
            role: 'user'
        };

        const mockLoginResponse = {
            data: {
                data: {
                    user: mockUser,
                    tokens: {
                        accessToken: 'access-token-123',
                        refreshToken: 'refresh-token-123'
                    }
                }
            }
        };

        vi.mocked(apiClient).mockResolvedValueOnce(mockLoginResponse);

        // Act
        renderWithAuthProvider();

        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        });

        // Click login button
        const loginButton = screen.getByText(/login/i);
        await userEvent.click(loginButton);

        // Assert
        await waitFor(() => {
            expect(apiClient).toHaveBeenCalledWith('/auth/login', {
                method: 'POST',
                data: { email: 'test@example.com', password: 'password' }
            });

            expect(authStorage.setAccessToken).toHaveBeenCalledWith(
                'access-token-123',
                'refresh-token-123'
            );

            expect(authStorage.setUser).toHaveBeenCalledWith(mockUser);
            expect(screen.getByText(/authenticated/i)).toBeInTheDocument();
            expect(screen.getByText(/username: testuser/i)).toBeInTheDocument();
        });
    });

    it('should handle logout correctly', async () => {
        // Arrange
        const mockUser = {
            id: 'user123',
            username: 'testuser',
            email: 'test@example.com',
            role: 'user'
        };

        // Mock that we are initially logged in
        vi.mocked(authStorage.getUser).mockReturnValueOnce(mockUser);

        // Act
        renderWithAuthProvider();

        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
            expect(screen.getByText(/authenticated/i)).toBeInTheDocument();
        });

        // Click logout button
        const logoutButton = screen.getByText(/logout/i);
        await userEvent.click(logoutButton);

        // Assert
        await waitFor(() => {
            expect(authStorage.clearAuth).toHaveBeenCalled();
            expect(screen.getByText(/not authenticated/i)).toBeInTheDocument();
        });
    });

    it('should handle API errors during login', async () => {
        // Arrange
        const mockError = new Error('Invalid credentials');
        vi.mocked(apiClient).mockRejectedValueOnce(mockError);

        // Mock console.error to prevent error output during test
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Act
        renderWithAuthProvider();

        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        });

        // Click login button
        const loginButton = screen.getByText(/login/i);
        await userEvent.click(loginButton);

        // Assert
        await waitFor(() => {
            expect(screen.getByText(/not authenticated/i)).toBeInTheDocument();
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        // Restore console.error
        consoleErrorSpy.mockRestore();
    });

    it('should restore authenticated session from storage', async () => {
        // Arrange
        const mockUser = {
            id: 'user123',
            username: 'testuser',
            email: 'test@example.com',
            role: 'user'
        };

        // Mock that we have a stored user session
        vi.mocked(authStorage.getUser).mockReturnValue(mockUser);
        vi.mocked(authStorage.getAccessToken).mockReturnValue('access-token-123');

        // Act
        renderWithAuthProvider();

        // Assert
        await waitFor(() => {
            expect(screen.getByText(/authenticated/i)).toBeInTheDocument();
            expect(screen.getByText(/username: testuser/i)).toBeInTheDocument();
        });
    });
});
