import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, AlertTriangle, Clock, CalendarIcon, Tags, Info, BarChart2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DataLoader } from "@/components/ui/data-loader";
import { Item } from "@/types/Items/Item";
import { ItemService } from "@/services/item-service";
import { formatDate } from "@/lib/utils/utils";

export default function ItemDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<Item | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const response = await ItemService.getById(id);
                setItem(response);
            } catch (err) {
                console.error("Failed to fetch item:", err);
                setError("Failed to load item details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }

        try {
            setIsLoading(true);
            await ItemService.delete(id);
            navigate("/items");
        } catch (err) {
            console.error("Failed to delete item:", err);
            setError("Failed to delete item. Please try again.");
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'archived':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    if (isLoading) {
        return <DataLoader loading={true} />;
    }

    if (error || !item) {
        return (
            <div className="container max-w-4xl py-8">
                <div className="flex flex-col items-center justify-center p-8">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p className="text-muted-foreground mb-4">{error || "Item not found"}</p>
                    <Button onClick={() => navigate("/items")}>
                        Go Back to Items
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl py-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="mr-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold">{item.name}</h1>
                    <Badge
                        className={`ml-3 ${getStatusColor(item.status)}`}
                    >
                        {item.status}
                    </Badge>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/items/edit/${id}`)}
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                    </Button>
                    <Button
                        variant={confirmDelete ? "destructive" : "outline"}
                        size="sm"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {confirmDelete ? "Confirm Delete" : "Delete"}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="details">
                <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="attributes">Attributes</TabsTrigger>
                    <TabsTrigger value="related">Related Items</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Item Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2">Description</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {item.description || "No description available"}
                                    </p>
                                </div>

                                {item.tags && item.tags.length > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-2 flex items-center">
                                            <Tags className="h-4 w-4 mr-1" />
                                            Tags
                                        </h3>
                                        <div className="flex flex-wrap gap-1">
                                            {item.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.images && item.images.length > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-2">Images</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {item.images.map((img, index) => (
                                                <div key={index} className="rounded-md overflow-hidden">
                                                    <img
                                                        src={img}
                                                        alt={`Item image ${index + 1}`}
                                                        className="w-full h-24 object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Type</span>
                                        <span className="text-sm font-medium">{item.type}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Created</span>
                                        <span className="text-sm font-medium">{formatDate(item.createdAt)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Updated</span>
                                        <span className="text-sm font-medium">{formatDate(item.updatedAt)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">ID</span>
                                        <span className="text-sm font-medium truncate ml-2" title={item.id}>
                                            {item.id.substring(0, 8)}...
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {item.customFields && Object.keys(item.customFields).length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Custom Fields</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {Object.entries(item.customFields).map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">{key}</span>
                                                <span className="text-sm font-medium">{String(value)}</span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="attributes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Item Attributes</CardTitle>
                            <CardDescription>
                                Detailed technical specifications and attributes for this item.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {item.attributes && item.attributes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {item.attributes.map(attr => (
                                        <div key={attr.id} className="border rounded-lg p-3">
                                            <div className="font-medium">{attr.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {attr.value} {attr.unit || ''}
                                            </div>
                                            {attr.category && (
                                                <Badge variant="outline" className="mt-1">
                                                    {attr.category}
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <Info className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">No attributes available for this item</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="related">
                    <Card>
                        <CardHeader>
                            <CardTitle>Related Items</CardTitle>
                            <CardDescription>
                                Other items that are related to this one.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8">
                                <Info className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">No related items found</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Item History</CardTitle>
                            <CardDescription>
                                Changes and activities related to this item over time.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8">
                                <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">No history available for this item</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
