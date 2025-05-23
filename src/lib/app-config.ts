import { CONSTANTS } from "./environment";

/**
 * Application configuration service
 * Centralizes all application configuration and provides
 * type-safe access to configuration values
 */
export class AppConfig {
    // App metadata
    static readonly appName = CONSTANTS.APP_NAME;
    static readonly appVersion = CONSTANTS.APP_VERSION;
    static readonly appDescription = CONSTANTS.APP_DESCRIPTION;
    static readonly appAuthor = CONSTANTS.APP_AUTHOR;
    static readonly appCopyright = CONSTANTS.APP_COPYRIGHT;

    // UI configuration
    static readonly appLogo = CONSTANTS.APP_LOGO;
    static readonly appFavicon = CONSTANTS.APP_FAVICON;
    static readonly defaultTheme = CONSTANTS.APP_THEME as 'light' | 'dark';
    static readonly defaultLanguage = CONSTANTS.APP_LANGUAGE;

    // API configuration
    static readonly apiUrl = CONSTANTS.API_URL;
    static readonly apiTimeout = 30000; // 30 seconds
    static readonly apiRetryAttempts = 3;

    // Authentication
    static readonly tokenRefreshBuffer = 60; // seconds before token expiry to refresh
    static readonly sessionTimeout = 1800; // 30 minutes

    // Feature flags - from environment or defaults
    static readonly features = {
        darkMode: import.meta.env.VITE_FEATURE_DARK_MODE === 'true',
        notifications: import.meta.env.VITE_FEATURE_NOTIFICATIONS === 'true',
    };

    // Currency formatting
    static readonly currencyCode = CONSTANTS.CURRENCY || 'USD';
    static readonly currencySymbol = CONSTANTS.CURRENCY_ICON || '$';

    // Pagination defaults
    static readonly defaultPageSize = 10;
    static readonly pageSizeOptions = [5, 10, 25, 50, 100];

    // Date formatting
    static readonly dateFormat = 'MMM dd, yyyy';
    static readonly timeFormat = 'HH:mm';
    static readonly dateTimeFormat = `${AppConfig.dateFormat} ${AppConfig.timeFormat}`;

    // Animation settings
    static readonly animationDuration = 300; // ms

    // File upload limits
    static readonly maxFileSize = 5 * 1024 * 1024; // 5MB
    static readonly allowedFileTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
}
