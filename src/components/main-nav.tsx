import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils/utils"
import { NavAuthRoutes } from "@/lib/constants"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    const location = useLocation()

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
            {NavAuthRoutes.filter((item) => item.showInNav !== false).map((item) => {
                const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path))

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex items-center text-sm font-medium transition-colors",
                            isActive
                                ? "text-primary font-semibold"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        {item.icon && <item.icon className={cn("mr-2 h-4 w-4", isActive && "text-primary")} />}
                        {item.name}
                    </Link>
                )
            })}
        </nav>
    )
}