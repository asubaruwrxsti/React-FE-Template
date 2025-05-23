import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import React from "react";

interface BreadcrumbItem {
    label: string;
    href: string;
};

interface BreadcrumbNavProps {
    items: BreadcrumbItem[];
    currentLabel?: string;
};

export function BreadcrumbNav({ items, currentLabel }: BreadcrumbNavProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, _) => (
                    <React.Fragment key={item.href}>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                    </React.Fragment>
                ))}
                {currentLabel && (
                    <BreadcrumbItem>
                        <BreadcrumbLink>{currentLabel}</BreadcrumbLink>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}