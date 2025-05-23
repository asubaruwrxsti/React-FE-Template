import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCard } from "@/components/users/user-card";
import { User, UserRole, UserStatus } from "@/types/Users/User";
import { Filter, Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";

// Dummy data for demonstration purposes
const dummyUsers: User[] = [
    {
        id: "1",
        username: "johndoe",
        email: "john.doe@example.com",
        role: "admin",
        isActive: true,
        status: "active",
        createdAt: "2023-01-01T10:00:00Z",
        updatedAt: "2023-06-15T14:30:00Z",
        profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
        personal: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "555-123-4567"
        }
    },
    {
        id: "2",
        username: "janesmith",
        email: "jane.smith@example.com",
        role: "manager",
        isActive: true,
        status: "active",
        createdAt: "2023-02-15T09:00:00Z",
        updatedAt: "2023-06-10T16:45:00Z",
        profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
        personal: {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            phone: "555-987-6543"
        }
    },
    {
        id: "3",
        username: "bobwilliams",
        email: "bob.williams@example.com",
        role: "user",
        isActive: false,
        status: "inactive",
        createdAt: "2023-03-20T11:30:00Z",
        updatedAt: "2023-05-05T10:15:00Z",
        personal: {
            firstName: "Bob",
            lastName: "Williams",
            email: "bob.williams@example.com"
        }
    },
    {
        id: "4",
        username: "sarahjones",
        email: "sarah.jones@example.com",
        role: "user",
        isActive: true,
        status: "pending",
        createdAt: "2023-04-10T14:00:00Z",
        updatedAt: "2023-06-01T09:30:00Z",
        personal: {
            firstName: "Sarah",
            lastName: "Jones",
            email: "sarah.jones@example.com",
            phone: "555-765-4321"
        }
    }
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(dummyUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [showFilters, setShowFilters] = useState(false);

    const navigate = useNavigate();

    // Filter users based on search term and filters
    const filteredUsers = users.filter((user) => {
        const matchesSearch = searchTerm === "" ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.personal?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.personal?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "" || user.role === roleFilter;
        const matchesStatus = statusFilter === "" || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleViewUser = (user: User) => {
        // In a real app, this would navigate to a user detail page
        toast.info(`Viewing ${user.personal?.firstName} ${user.personal?.lastName}`);
    };

    const handleEditUser = (user: User) => {
        // In a real app, this would navigate to a user edit page
        toast.info(`Editing ${user.personal?.firstName} ${user.personal?.lastName}`);
    };

    const handleDeleteUser = (user: User) => {
        setUsers(users.filter(u => u.id !== user.id));
        toast.success(`User ${user.personal?.firstName} ${user.personal?.lastName} deleted`);
    };

    const handleAddUser = () => {
        // In a real app, this would navigate to a user creation page
        toast.info("Adding new user");
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                    <Users className="mr-2 h-8 w-8" /> User Management
                </h1>
                <Button onClick={handleAddUser}>
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Search & Filter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search users..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Filters
                            </Button>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Role</label>
                                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Roles" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Roles</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="guest">Guest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Statuses</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onView={handleViewUser}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                        />
                    ))
                ) : (
                    <div className="col-span-3 py-8 text-center text-muted-foreground">
                        No users found matching your search criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
