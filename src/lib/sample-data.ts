import { Item, ItemType, ItemStatus, ItemAttribute } from "@/types/Items/Item";
import { User, UserRole, UserStatus } from "@/types/Users/User";

/**
 * Generate a random ID
 */
function generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Generate a random date within a range
 */
function randomDate(start: Date, end: Date): string {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

/**
 * Generate random sample items
 */
export function generateSampleItems(count = 10): Item[] {
    const types: ItemType[] = ['type1', 'type2', 'type3', 'type4', 'type5', 'other'];
    const statuses: ItemStatus[] = ['active', 'inactive', 'pending', 'archived'];

    return Array.from({ length: count }, (_, i) => {
        const id = generateId();
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const createdAt = randomDate(new Date(2023, 0, 1), new Date());

        const attributes: ItemAttribute[] = Array.from({ length: Math.floor(Math.random() * 5) }, (_, j) => ({
            id: generateId(),
            name: `Attribute ${j + 1}`,
            value: Math.random() > 0.5 ? Math.floor(Math.random() * 100) : `Value ${j + 1}`,
            unit: Math.random() > 0.7 ? ['kg', 'cm', 'm', 'inches'][Math.floor(Math.random() * 4)] : undefined,
            category: Math.random() > 0.6 ? ['physical', 'digital', 'performance', 'quality'][Math.floor(Math.random() * 4)] : undefined
        }));

        const tags = Math.random() > 0.3
            ? Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => `tag-${j + 1}`)
            : undefined;

        return {
            id,
            name: `Item ${i + 1}`,
            description: Math.random() > 0.3 ? `This is a sample item of type ${type}` : undefined,
            type,
            status,
            createdAt,
            updatedAt: randomDate(new Date(createdAt), new Date()),
            attributes: attributes.length > 0 ? attributes : undefined,
            tags,
            featuredImage: Math.random() > 0.5 ? `https://picsum.photos/seed/${id}/300/200` : undefined,
            images: Math.random() > 0.7
                ? Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => `https://picsum.photos/seed/${id}-${j}/300/200`)
                : undefined,
            customFields: Math.random() > 0.6 ? {
                priority: Math.floor(Math.random() * 5) + 1,
                category: ['category-a', 'category-b', 'category-c'][Math.floor(Math.random() * 3)],
                isExternal: Math.random() > 0.5
            } : undefined
        };
    });
}

/**
 * Generate random sample users
 */
export function generateSampleUsers(count = 5): User[] {
    const roles: UserRole[] = ['admin', 'manager', 'user', 'guest'];
    const statuses: UserStatus[] = ['active', 'inactive', 'pending', 'suspended'];

    const names = [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Smith' },
        { first: 'Robert', last: 'Johnson' },
        { first: 'Emily', last: 'Williams' },
        { first: 'Michael', last: 'Brown' },
        { first: 'Sarah', last: 'Jones' },
        { first: 'David', last: 'Miller' },
        { first: 'Lisa', last: 'Davis' },
        { first: 'James', last: 'Wilson' },
        { first: 'Jessica', last: 'Martinez' }
    ];

    return Array.from({ length: count }, (_, i) => {
        const id = generateId();
        const nameIndex = i % names.length;
        const firstName = names[nameIndex].first;
        const lastName = names[nameIndex].last;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        const role = roles[Math.floor(Math.random() * roles.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const createdAt = randomDate(new Date(2022, 0, 1), new Date());

        return {
            id,
            username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
            email,
            role,
            isActive: status === 'active',
            status,
            createdAt,
            updatedAt: randomDate(new Date(createdAt), new Date()),
            profilePicture: Math.random() > 0.3 ? `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${nameIndex + 1}.jpg` : undefined,
            phoneNumber: Math.random() > 0.4 ? `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}` : undefined,
            personal: {
                firstName,
                lastName,
                email,
                phone: Math.random() > 0.4 ? `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}` : undefined,
                address: Math.random() > 0.6 ? {
                    street: `${Math.floor(Math.random() * 9000 + 1000)} Main St`,
                    city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
                    state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
                    zipCode: `${Math.floor(Math.random() * 90000 + 10000)}`,
                    country: 'USA'
                } : undefined
            },
            preferences: Math.random() > 0.5 ? {
                theme: ['light', 'dark', 'system'][Math.floor(Math.random() * 3)] as 'light' | 'dark' | 'system',
                notificationsEnabled: Math.random() > 0.3,
                language: ['en', 'es', 'fr', 'de'][Math.floor(Math.random() * 4)],
                timezone: ['America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo'][Math.floor(Math.random() * 4)],
                dateFormat: ['MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd'][Math.floor(Math.random() * 3)],
                timeFormat: Math.random() > 0.5 ? '12h' : '24h'
            } : undefined
        };
    });
}

/**
 * Generate random analytics data for dashboard
 */
export function generateAnalyticsData(months = 6) {
    return {
        itemsByStatus: [
            { name: 'Active', value: Math.floor(Math.random() * 100) + 50 },
            { name: 'Inactive', value: Math.floor(Math.random() * 60) + 20 },
            { name: 'Pending', value: Math.floor(Math.random() * 40) + 10 },
            { name: 'Archived', value: Math.floor(Math.random() * 30) + 5 }
        ],
        itemsByType: [
            { name: 'Type 1', value: Math.floor(Math.random() * 80) + 40 },
            { name: 'Type 2', value: Math.floor(Math.random() * 70) + 30 },
            { name: 'Type 3', value: Math.floor(Math.random() * 60) + 20 },
            { name: 'Type 4', value: Math.floor(Math.random() * 50) + 15 },
            { name: 'Type 5', value: Math.floor(Math.random() * 40) + 10 },
            { name: 'Other', value: Math.floor(Math.random() * 30) + 5 }
        ],
        usersByRole: [
            { name: 'Admin', value: Math.floor(Math.random() * 5) + 2 },
            { name: 'Manager', value: Math.floor(Math.random() * 10) + 5 },
            { name: 'User', value: Math.floor(Math.random() * 30) + 15 },
            { name: 'Guest', value: Math.floor(Math.random() * 20) + 8 }
        ],
        // Generate monthly data for the line chart
        monthlyData: Array.from({ length: months }, (_, i) => {
            const month = new Date();
            month.setMonth(month.getMonth() - (months - 1) + i);

            return {
                name: month.toLocaleDateString('en-US', { month: 'short' }),
                items: Math.floor(Math.random() * 30) + 10,
                users: Math.floor(Math.random() * 10) + 2,
                activity: Math.floor(Math.random() * 100) + 20
            };
        }),
        // Generate recent activities
        recentActivities: Array.from({ length: 10 }, (_, i) => {
            const types = ['created', 'updated', 'deleted', 'viewed', 'exported'];
            const actionType = types[Math.floor(Math.random() * types.length)];
            const entityTypes = ['item', 'user', 'settings', 'report'];
            const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
            const timestamp = new Date();
            timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 72));

            return {
                id: generateId(),
                actionType,
                entityType,
                entityId: generateId(),
                entityName: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${Math.floor(Math.random() * 100) + 1}`,
                timestamp: timestamp.toISOString(),
                user: {
                    id: generateId(),
                    name: `${['John', 'Jane', 'Michael', 'Sarah', 'David'][Math.floor(Math.random() * 5)]} ${['Doe', 'Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 5)]}`,
                    avatar: Math.random() > 0.3 ? `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10) + 1}.jpg` : undefined
                }
            };
        })
    };
}
