import React, { useState, ReactNode } from "react"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldValues, UseFormReturn } from "react-hook-form"

export interface TabConfig {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface TabFormWrapperProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    tabs: TabConfig[];
    tabContents: Record<string, ReactNode>;
    onSubmit: (values: T) => void;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
}

export function TabFormWrapper<T extends FieldValues>({
    form,
    tabs,
    tabContents,
    onSubmit,
    activeTab: externalActiveTab,
    onTabChange
}: TabFormWrapperProps<T>) {
    const [internalActiveTab, setInternalActiveTab] = useState<string>(tabs[0]?.id || "");

    // Use either external controlled state or internal state
    const activeTab = externalActiveTab || internalActiveTab;

    const handleTabChange = (tabId: string) => {
        if (onTabChange) {
            onTabChange(tabId);
        } else {
            setInternalActiveTab(tabId);
        }
    };

    // Get current form progress
    const getProgress = () => {
        const tabIds = tabs.map(tab => tab.id);
        const currentIndex = tabIds.indexOf(activeTab);
        return ((currentIndex + 1) / tabIds.length) * 100;
    };

    return (
        <div className="animate-fade-in space-y-8">
            {/* Progress indicator */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className="absolute left-0 top-0 h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${getProgress()}%` }}
                />
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className={`grid w-full grid-cols-${tabs.length}`}>
                            {tabs.map((tab) => (
                                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                                    {tab.icon}
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {tabs.map((tab) => (
                            <TabsContent key={tab.id} value={tab.id}>
                                {tabContents[tab.id]}
                            </TabsContent>
                        ))}
                    </Tabs>
                </form>
            </Form>
        </div>
    );
}