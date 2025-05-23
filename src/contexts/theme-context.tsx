import { createContext, useContext, useEffect, useState } from "react";
import { AppConfig } from "@/lib/app-config";

export type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "system",
    setTheme: () => { },
});

export function ThemeProvider({
    children,
    defaultTheme = AppConfig.defaultTheme,
    storageKey = "app-theme",
}: {
    children: React.ReactNode;
    defaultTheme?: ThemeType;
    storageKey?: string;
}) {
    const [theme, setTheme] = useState<ThemeType>(
        () => (localStorage.getItem(storageKey) as ThemeType) || defaultTheme
    );

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme: ThemeType) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
