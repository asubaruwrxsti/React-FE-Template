import { Home, ArrowLeft, Search, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12 md:py-16">
                <div className="relative mb-8 h-52 w-52 animate-float md:h-64 md:w-64">
                    <div className="absolute -right-4 -top-4 h-24 w-24 animate-pulse rounded-full bg-primary/10"></div>
                    <div className="absolute -bottom-6 -left-6 h-32 w-32 animate-pulse rounded-full bg-primary/10 [animation-delay:1s]"></div>
                    <div className="relative flex h-full w-full items-center justify-center rounded-lg border bg-card p-6 shadow-lg">
                        <div className="text-center">
                            <div className="flex justify-center">
                                <div className="relative mb-2 h-24 w-24">
                                    <MapPin className="h-full w-full text-muted-foreground opacity-10" />
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                                        <Search className="h-12 w-12 text-primary" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-xl font-semibold tracking-tight md:text-2xl">Not Found</p>
                            <p className="text-sm text-muted-foreground md:text-base">We couldn't locate the page you're looking for.</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6 space-y-3 text-center">
                    <h2 className="text-xl font-medium">Looking for something?</h2>
                    <p className="mx-auto max-w-md text-muted-foreground">
                        The page you requested couldn't be found. It might have been moved, renamed, or is temporarily unavailable.
                    </p>
                </div>

                <div className="mb-10 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                    <Button asChild size="lg" className="animate-fade-in-up">
                        <Link to="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="animate-fade-in-up [animation-delay:200ms]">
                        <Link to="/properties">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Browse Properties
                        </Link>
                    </Button>
                </div>

                <div className="grid w-full max-w-4xl grid-cols-1 gap-4 grid-cols-2">
                    <div className="animate-fade-in-up rounded-lg border bg-card p-4 shadow-sm [animation-delay:300ms]">
                        <h3 className="mb-2 font-medium">Go back to</h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>
                                <Link to="/properties" className="hover:text-primary hover:underline">
                                    Property Listings
                                </Link>
                            </li>
                            <li>
                                <Link to="/tenants" className="hover:text-primary hover:underline">
                                    Tenant Directory
                                </Link>
                            </li>
                            <li>
                                <Link to="/maintenance" className="hover:text-primary hover:underline">
                                    Maintenance Requests
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="animate-fade-in-up rounded-lg border bg-card p-4 shadow-sm [animation-delay:500ms]">
                        <h3 className="mb-2 font-medium">Account</h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>
                                <Link to="/login" className="hover:text-primary hover:underline">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup" className="hover:text-primary hover:underline">
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link to="/forgot-password" className="hover:text-primary hover:underline">
                                    Reset Password
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}