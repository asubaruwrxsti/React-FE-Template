import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AppConfig } from "@/lib/app-config";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = await login({ email, password });

            if (success) {
                toast.success("Login successful");
                navigate("/dashboard");
            } else {
                throw new Error("Invalid credentials");
            }
        } catch (error: any) {
            toast.error("Login failed: " + error.message);
            setPassword("");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full">
            {/* Left column - Image (hidden on mobile, 3/5 width on md screens and up) */}
            <div className="hidden md:block md:w-3/5 bg-slate-800 rounded-br-3xl rounded-tr-3xl overflow-hidden">
                <div className="h-full w-full flex items-center justify-center p-4 lg:p-8">
                    <img
                        src="/assets/images/app-hero.jpg"
                        alt="Application Hero"
                        className="max-w-full max-h-full object-cover rounded-2xl shadow-lg"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "https://placehold.co/800x600/1e293b/e2e8f0?text=Application+Template";
                        }}
                    />
                </div>
            </div>

            {/* Right column - Login form (full width on mobile, 2/5 width on md screens and up) */}
            <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 min-h-[100vh] md:min-h-0">
                <div className="w-full max-w-md mx-auto">
                    <Card className="w-full shadow-lg border-slate-200">
                        <CardHeader className="space-y-1 px-4 sm:px-6 pt-2">
                            <CardTitle className="text-xl sm:text-2xl font-bold text-center">{AppConfig.appName}</CardTitle>
                            <CardDescription className="text-center text-sm sm:text-base">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="border-slate-300 h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                                        <Button
                                            variant="link"
                                            className="px-0 text-xs text-slate-500 h-auto"
                                            onClick={() => navigate("/forgot-password")}
                                            type="button"
                                        >
                                            Forgot password?
                                        </Button>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="border-slate-300 pr-10 h-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-0 top-0 h-full px-3 py-2 text-slate-500"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-10"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <LogIn className="mr-2 h-4 w-4" />
                                            Sign in
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center px-4 sm:px-6">
                            <p className="text-xs sm:text-sm text-slate-500">
                                Don't have an account?{" "}
                                <Button
                                    variant="link"
                                    className="px-0 text-xs sm:text-sm text-slate-700 h-auto"
                                    onClick={() => navigate("/register")}
                                >
                                    Sign up
                                </Button>
                            </p>
                        </CardFooter>
                    </Card>

                    <div className="flex justify-start pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/")}
                            className="text-slate-500 hover:text-slate-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}