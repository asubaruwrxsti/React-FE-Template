import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemCard } from "@/components/items/item-card";
import { DataLoader } from "@/components/ui/data-loader";
import { statusOptions, itemTypes } from "@/lib/constants";
import { Item, ItemStatus, ItemType } from "@/types/Items/Item";
import { ItemService } from "@/services/item-service";
import { useAuth } from "@/contexts/auth-context";

interface FilterOptions {
    search: string;
    status: ItemStatus[];
    types: ItemType[];
}

export default function ItemsPage() {
    const { isAuthenticated } = useAuth();
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("all");
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        search: "",
        status: [],
        types: [],
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Filter items based on tab
                let statusFilter: ItemStatus[] = [];
                if (activeTab === "active") statusFilter = ["active"];
                if (activeTab === "inactive") statusFilter = ["inactive"];
                if (activeTab === "pending") statusFilter = ["pending"];
                if (activeTab === "archived") statusFilter = ["archived"];

                const response = await ItemService.search({
                    ...filterOptions,
                    status: statusFilter.length ? statusFilter : filterOptions.status,
                    page: 1,
                    limit: 20,
                });

                setItems(response.data);
            } catch (err) {
                console.error("Failed to fetch items:", err);
                setError("Failed to load items. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchItems();
        }
    }, [isAuthenticated, activeTab, filterOptions]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterOptions(prev => ({ ...prev, search: e.target.value }));
    };

    const handleDelete = async (item: Item) => {
        try {
            await ItemService.delete(item.id);
            setItems(items.filter(i => i.id !== item.id));
        } catch (error) {
            console.error("Failed to delete item:", error);
            setError("Failed to delete item. Please try again.");
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <DataLoader loading={true} />;
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-red-500">{error}</p>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
            );
        }

        if (items.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-muted-foreground mb-4">No items found</p>
                    <Link to="/items/add">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Item
                        </Button>
                    </Link>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(item => (
                    <ItemCard
                        key={item.id}
                        item={item}
                        onView={(item) => window.location.href = `/items/${item.id}`}
                        onEdit={(item) => window.location.href = `/items/edit/${item.id}`}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Items</h1>
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                    <Link to="/items/add">
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mb-6">
                <Input
                    type="search"
                    placeholder="Search items..."
                    className="max-w-sm"
                    value={filterOptions.search}
                    onChange={handleSearchChange}
                />
            </div>

            {showFilters && (
                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-3">Filter Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Filter controls would go here */}
                        <div>
                            <label className="text-sm font-medium">Status</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {statusOptions.map(status => (
                                    <Button
                                        key={status.value}
                                        variant={filterOptions.status.includes(status.value as ItemStatus) ? "default" : "outline"}
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => {
                                            setFilterOptions(prev => {
                                                const newStatus = [...prev.status];
                                                const index = newStatus.indexOf(status.value as ItemStatus);
                                                if (index >= 0) {
                                                    newStatus.splice(index, 1);
                                                } else {
                                                    newStatus.push(status.value as ItemStatus);
                                                }
                                                return { ...prev, status: newStatus };
                                            });
                                        }}
                                    >
                                        {status.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Type</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {itemTypes.map(type => (
                                    <Button
                                        key={type.value}
                                        variant={filterOptions.types.includes(type.value as ItemType) ? "default" : "outline"}
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => {
                                            setFilterOptions(prev => {
                                                const newTypes = [...prev.types];
                                                const index = newTypes.indexOf(type.value as ItemType);
                                                if (index >= 0) {
                                                    newTypes.splice(index, 1);
                                                } else {
                                                    newTypes.push(type.value as ItemType);
                                                }
                                                return { ...prev, types: newTypes };
                                            });
                                        }}
                                    >
                                        {type.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All Items</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6">
                    {renderContent()}
                </TabsContent>
            </Tabs>
        </div>
    );
}
