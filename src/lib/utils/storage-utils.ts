/**
 * Type-safe localStorage utility for consistent data persistence
 */

/**
 * Get an item from localStorage with type safety
 * @param key Storage key
 * @param defaultValue Default value if key not found
 * @returns Parsed value from storage or default value
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
    try {
        const item = localStorage.getItem(key);
        if (item === null || item === 'undefined') return defaultValue;
        return JSON.parse(item) as T;
    } catch (e) {
        console.error(`Error retrieving ${key} from localStorage:`, e);
        return defaultValue;
    }
}

/**
 * Save an item to localStorage
 * @param key Storage key
 * @param value Value to store
 */
export function setStorageItem<T>(key: string, value: T): void {
    try {
        if (value === undefined) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch (e) {
        console.error(`Error storing ${key} in localStorage:`, e);
    }
}

/**
 * Remove an item from localStorage
 * @param key Storage key
 */
export function removeStorageItem(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error(`Error removing ${key} from localStorage:`, e);
    }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage(): void {
    try {
        localStorage.clear();
    } catch (e) {
        console.error('Error clearing localStorage:', e);
    }
}

/**
 * Auth-specific storage functions
 */
export const authStorage = {
    getUser: <T>() => getStorageItem<T>('user', null as unknown as T),
    setUser: <T>(user: T) => setStorageItem<T>('user', user),
    getAccessToken: () => getStorageItem<string | null>('accessToken', null),
    setAccessToken: (token: string) => setStorageItem('accessToken', token),
    getRefreshToken: () => getStorageItem<string | null>('refreshToken', null),
    setRefreshToken: (token: string) => setStorageItem('refreshToken', token),
    clearAuth: () => {
        removeStorageItem('user');
        removeStorageItem('accessToken');
        removeStorageItem('refreshToken');
    }
};