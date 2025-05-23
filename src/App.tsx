import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ArrowUp } from 'lucide-react'
import { AuthProvider } from './contexts/auth-context'
import { AlertProvider } from './contexts/alert-context'
import { ThemeProvider } from './contexts/theme-context'
import { ProtectedRoute } from './components/protected-route'
import { AppRoutes } from './lib/constants'
import { PageTransition } from './components/page-transition'
import NotFoundPage from './components/not-found'
import { MainLayout } from './components/layouts/main-layout'
import { ScrollToTop } from './components/scroll-to-top'
import { useAppState } from './lib/app-state'

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { ui } = useAppState();
    const shouldAnimate = ui.features.animations;

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: shouldAnimate ? "smooth" : "auto"
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <button
            onClick={scrollToTop}
            className={`
    fixed bottom-8 right-8 p-3 
    bg-primary text-primary-foreground rounded-full shadow-lg
    transition-all duration-300 
    hover:scale-110
    ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
  `}
        >
            <ArrowUp className="w-6 h-6" />
        </button>
    );
};

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <PageTransition>
            <Routes location={location} key={location.pathname}>
                {/* Public routes */}
                {AppRoutes.filter(route => !route.protected).map(route => (
                    <>
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<route.element />}
                        />
                        {route.slug && (
                            <Route
                                key={`${route.path}/${route.slug}`}
                                path={`${route.path}/${route.slug}`}
                                element={<route.element />}
                            />
                        )}
                    </>
                ))}

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    {AppRoutes.filter(route => route.protected).map(route => (
                        <>
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <MainLayout>
                                        <route.element />
                                    </MainLayout>
                                }
                            />
                            {route.slug && (
                                <Route
                                    key={`${route.path}/${route.slug}`}
                                    path={`${route.path}/${route.slug}`}
                                    element={
                                        <MainLayout>
                                            <route.element />
                                        </MainLayout>
                                    }
                                />
                            )}
                        </>
                    ))}
                </Route>

                {/* Redirect to login by default */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </PageTransition>
    );
}

function App() {
    return (
        <AlertProvider>
            <ThemeProvider>
                <Router>
                    <AuthProvider>
                        <ScrollToTop />
                        <AnimatedRoutes />
                        <Toaster />
                    </AuthProvider>
                </Router>
                <ScrollToTopButton />
            </ThemeProvider>
        </AlertProvider>
    );
}

export default App
