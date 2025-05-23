import React, { useState, useEffect } from "react";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (title) {
            document.title = `${title} | CEN-302`;
            return;
        }

        const path = location.pathname;
        const pathParts = path.split('/').filter(Boolean);

        if (pathParts.length === 0) {
            document.title = "Home | CEN-302";
            return;
        }

        const pageName = pathParts[pathParts.length - 1]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        document.title = `${pageName} | CEN-302`;
    }, [location.pathname, title]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <div
                className={`sticky top-0 z-40 border-b shadow-sm transition-all duration-300 
                ${isScrolled
                        ? 'bg-background/70 backdrop-blur-sm'
                        : 'bg-background'}`}
            >
                <div
                    className={`flex items-center px-4 transition-all duration-300 
                    ${isScrolled ? 'h-12' : 'h-16'}`}
                >
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav />
                    </div>
                </div>
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}