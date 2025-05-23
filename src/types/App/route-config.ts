import { ComponentType } from "react";

export interface RouteConfig {
    path: string;
    name: string;
    element: ComponentType;
    protected: boolean;
    icon?: ComponentType<React.SVGProps<SVGSVGElement>>;
    redirectIfLoggedIn?: boolean;
    description?: string;
    showInNav?: boolean | true;
    slug?: string;
}