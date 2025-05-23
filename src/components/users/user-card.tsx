import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Mail, Phone } from "lucide-react";
import { User, UserRole, UserStatus } from "@/types/Users/User";

interface UserCardProps {
    user: User;
    onView?: (user: User) => void;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
}

export function UserCard({ user, onView, onEdit, onDelete }: UserCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (isDeleting) {
            onDelete?.(user);
            setIsDeleting(false);
        } else {
            setIsDeleting(true);
        }
    };

    const getStatusColor = (status: UserStatus) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'suspended':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'manager':
                return 'bg-blue-100 text-blue-800';
            case 'user':
                return 'bg-green-100 text-green-800';
            case 'guest':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl truncate">{user.personal?.firstName} {user.personal?.lastName}</CardTitle>
                    <div className="flex space-x-1">
                        <Badge variant="outline" className={getStatusColor(user.status || 'active')}>
                            {user.status || 'active'}
                        </Badge>
                        <Badge variant="outline" className={getRoleColor(user.role)}>
                            {user.role}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="truncate">{user.email}</span>
                    </div>
                    {user.phoneNumber && (
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{user.phoneNumber}</span>
                        </div>
                    )}
                    <div className="text-sm mt-2">
                        <span className="text-muted-foreground">Last active: </span>
                        <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={() => onView?.(user)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit?.(user)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                    variant={isDeleting ? "destructive" : "ghost"}
                    size="sm"
                    onClick={handleDelete}
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {isDeleting ? "Confirm" : "Delete"}
                </Button>
            </CardFooter>
        </Card>
    );
}
