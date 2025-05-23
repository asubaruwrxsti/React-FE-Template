import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { Item } from "@/types/Items/Item";

interface ItemCardProps {
    item: Item;
    onView?: (item: Item) => void;
    onEdit?: (item: Item) => void;
    onDelete?: (item: Item) => void;
}

export function ItemCard({ item, onView, onEdit, onDelete }: ItemCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (isDeleting) {
            onDelete?.(item);
            setIsDeleting(false);
        } else {
            setIsDeleting(true);
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

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
            {item.featuredImage && (
                <div className="relative h-48 w-full overflow-hidden">
                    <img
                        src={item.featuredImage}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <Badge
                        className={`absolute top-2 right-2 ${getStatusColor(item.status)}`}
                    >
                        {item.status}
                    </Badge>
                </div>
            )}

            <CardHeader className="p-4">
                <CardTitle className="line-clamp-1 text-lg">{item.name}</CardTitle>
                <div className="flex flex-wrap gap-1">
                    {item.tags?.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {item.tags && item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3} more
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                    {item.description ?? "No description available."}
                </p>
                <div className="mt-2">
                    <p className="text-sm font-medium">Type: <span className="font-normal">{item.type}</span></p>
                    <p className="text-sm font-medium">Updated: <span className="font-normal">{new Date(item.updatedAt).toLocaleDateString()}</span></p>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between p-4 pt-0">
                {onView && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(item)}
                        className="flex items-center gap-1"
                    >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                    </Button>
                )}

                <div className="flex gap-2">
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(item)}
                            className="flex items-center gap-1"
                        >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only">Edit</span>
                        </Button>
                    )}

                    {onDelete && (
                        <Button
                            variant={isDeleting ? "destructive" : "ghost"}
                            size="sm"
                            onClick={handleDelete}
                            className="flex items-center gap-1"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only">{isDeleting ? "Confirm" : "Delete"}</span>
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
