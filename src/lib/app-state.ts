import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * App state with user preferences and application settings
 */
interface AppState {
    /**
     * Theme preference
     */
    theme: 'light' | 'dark' | 'system';

    /**
     * UI preferences like sidebar open state
     */
    ui: {
        /**
         * Whether the sidebar is open
         */
        sidebarOpen: boolean;

        /**
         * User preference for content density
         */
        contentDensity: 'compact' | 'comfortable' | 'spacious';

        /**
         * Color scheme preference
         */
        colorScheme: string;

        /**
         * Current view mode for list pages
         */
        viewMode: 'grid' | 'list' | 'table';

        /**
         * Current search query
         */
        searchQuery: string;

        /**
         * Remember applied filters
         */
        filters: Record<string, any>;

        /**
         * Various feature toggles that users can enable/disable
         */
        features: {
            /**
             * Enables animations
             */
            animations: boolean;

            /**
             * Whether to show the activity feed
             */
            activityFeed: boolean;
        };
    };

    /**
     * Pagination preferences
     */
    pagination: {
        pageSize: number;
    };

    /**
     * Set the theme
     */
    setTheme: (theme: 'light' | 'dark' | 'system') => void;

    /**
     * Toggle sidebar
     */
    toggleSidebar: () => void;

    /**
     * Set sidebar state
     */
    setSidebar: (open: boolean) => void;

    /**
     * Set content density
     */
    setContentDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;

    /**
     * Set color scheme
     */
    setColorScheme: (scheme: string) => void;

    /**
     * Toggle feature
     */
    toggleFeature: (feature: keyof AppState['ui']['features']) => void;

    /**
     * Set page size
     */
    setPageSize: (size: number) => void;

    /**
     * Reset all UI preferences to defaults
     */
    resetPreferences: () => void;
}

/**
 * Default state for app preferences
 */
const defaultState: AppState = {
    theme: 'system',
    ui: {
        sidebarOpen: true,
        contentDensity: 'comfortable',
        colorScheme: 'default',
        viewMode: 'list',
        searchQuery: '',
        filters: {},
        features: {
            animations: true,
            activityFeed: true,
        },
    },
    pagination: {
        pageSize: 20,
    },
    setTheme: function (theme: 'light' | 'dark' | 'system'): void {
        throw new Error('Function not implemented.');
    },
    toggleSidebar: function (): void {
        throw new Error('Function not implemented.');
    },
    setSidebar: function (open: boolean): void {
        throw new Error('Function not implemented.');
    },
    setContentDensity: function (density: 'compact' | 'comfortable' | 'spacious'): void {
        throw new Error('Function not implemented.');
    },
    setColorScheme: function (scheme: string): void {
        throw new Error('Function not implemented.');
    },
    toggleFeature: function (feature: keyof AppState['ui']['features']): void {
        throw new Error('Function not implemented.');
    },
    setPageSize: function (size: number): void {
        throw new Error('Function not implemented.');
    },
    resetPreferences: function (): void {
        throw new Error('Function not implemented.');
    }
};

/**
 * App state store with persisted preferences
 */
export const useAppState = create<AppState>()(
    persist(
        (set) => ({
            ...defaultState,

            setTheme: (theme) => set({ theme }),

            toggleSidebar: () =>
                set((state) => ({ ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen } })),

            setSidebar: (open) =>
                set((state) => ({ ui: { ...state.ui, sidebarOpen: open } })),

            setContentDensity: (density) =>
                set((state) => ({ ui: { ...state.ui, contentDensity: density } })),

            setColorScheme: (colorScheme) =>
                set((state) => ({ ui: { ...state.ui, colorScheme } })),

            toggleFeature: (feature) =>
                set((state) => ({
                    ui: {
                        ...state.ui,
                        features: {
                            ...state.ui.features,
                            [feature]: !state.ui.features[feature],
                        },
                    },
                })),

            setPageSize: (pageSize) =>
                set((state) => ({ pagination: { ...state.pagination, pageSize } })),

            resetPreferences: () => set(defaultState),
        }),
        {
            name: 'app-preferences',
        }
    )
);
