/**
 * User status types
 */
export type UserStatus =
    | 'active'
    | 'inactive'
    | 'pending'
    | 'suspended';

/**
 * User role types
 */
export type UserRole =
    | 'admin'
    | 'manager'
    | 'user'
    | 'guest';

/**
 * User personal information
 */
export interface UserPersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    jobTitle?: string;
    department?: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
}

/**
 * User account details
 */
export interface UserAccount {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    lastLogin?: string;
    isEmailVerified: boolean;
    isTwoFactorEnabled: boolean;
    permissions?: string[];
}

/**
 * Complete user information
 */
export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    status?: UserStatus;
    createdAt: Date | string;
    updatedAt: Date | string;
    profilePicture?: string;
    phoneNumber?: string;
    personal?: UserPersonalInfo;
    preferences?: UserPreferences;
    metadata?: Record<string, any>;
}

/**
 * User search criteria
 */
export interface UserSearchCriteria {
    name?: string;
    email?: string;
    role?: UserRole[];
    status?: UserStatus[];
    createdAfter?: string;
    createdBefore?: string;
    sort?: {
        field: string;
        direction: 'asc' | 'desc';
    };
    page?: number;
    limit?: number;
}