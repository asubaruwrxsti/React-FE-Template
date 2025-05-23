import { LogIn, LayoutDashboard, FilePlus, Users, ListPlus } from "lucide-react";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import { RouteConfig } from "@/types/App/route-config";

export const DEFAULT_TIMEOUT = 3000;

/**
 * Application routes configuration
 * This is a central place to define all routes for the application
 * Add your routes here and they will be automatically registered in the router
 */
export const AppRoutes: RouteConfig[] = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        element: Dashboard,
        protected: true,
        icon: LayoutDashboard,
    },
    {
        path: '/login',
        name: 'Login',
        element: Login,
        protected: false,
        redirectIfLoggedIn: true,
        icon: LogIn,
    },
    {
        path: '/data',
        name: 'Data Management',
        element: () => null, // Placeholder for a data management page
        protected: true,
        icon: FilePlus,
        showInNav: true,
    },
    {
        path: '/users',
        name: 'Users',
        element: () => null, // Placeholder for a users page
        protected: true,
        icon: Users,
        showInNav: true,
    },
    {
        path: '/items',
        name: 'Items',
        element: () => null, // Placeholder for an items page
        protected: true,
        icon: ListPlus,
        showInNav: true,
    }
];

/**
 * Navigation routes that should appear in auth-protected navigation 
 */
export const NavAuthRoutes = AppRoutes.filter(route => route.protected);

/**
 * Format options for various data types
 */
export const formatOptions = {
    date: {
        short: 'MM/dd/yyyy',
        medium: 'MMM d, yyyy',
        long: 'MMMM d, yyyy'
    },
    number: {
        decimal: 2,
        thousand: ','
    },
    currency: {
        style: 'currency',
        currency: 'USD'
    }
};

/**
 * Feature flags for enabling/disabling features
 */
export const featureFlags = {
    enableDarkMode: true,
    enableNotifications: true,
    enableExport: true,
    enableBulkActions: true,
    enableAdvancedFilters: true,
    enableDataVisualization: true
};

/**
 * Common error messages for various scenarios
 */

export const errorMessages = new Map<number, string>([
    [400, "Bad Request"],
    [401, "Unauthorized"],
    [403, "Forbidden"],
    [404, "Not Found"],
    [500, "Internal Server Error"],
    // Add more as needed
]);


/**
 * Common status options that can be reused across entities
 */
export const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "archived", label: "Archived" }
];

/**
 * Common generic item types
 */
export const itemTypes = [
    { value: "type1", label: "Type 1" },
    { value: "type2", label: "Type 2" },
    { value: "type3", label: "Type 3" },
    { value: "type4", label: "Type 4" },
    { value: "type5", label: "Type 5" },
    { value: "other", label: "Other" }
];

/**
 * Common generic features list
 */
export const featuresList = [
    { id: "feature1", label: "Feature 1" },
    { id: "feature2", label: "Feature 2" },
    { id: "feature3", label: "Feature 3" },
    { id: "feature4", label: "Feature 4" },
    { id: "feature5", label: "Feature 5" },
    { id: "feature6", label: "Feature 6" },
    { id: "feature7", label: "Feature 7" },
    { id: "feature8", label: "Feature 8" },
    { id: "feature9", label: "Feature 9" }
];
