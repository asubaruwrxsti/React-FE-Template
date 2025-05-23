/**
 * Represents a generic item in the system
 */
export interface Item {
    id: string;
    name: string;
    description?: string;
    type: ItemType;
    status: ItemStatus;
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, any>;
    tags?: string[];
    featuredImage?: string;
    images?: string[];
    attributes?: ItemAttribute[];
    customFields?: Record<string, any>;
}

/**
 * Supported item types
 */
export type ItemType =
    | 'type1'
    | 'type2'
    | 'type3'
    | 'type4'
    | 'type5'
    | 'other';

/**
 * Item status options
 */
export type ItemStatus =
    | 'active'
    | 'inactive'
    | 'pending'
    | 'archived';

/**
 * Item attribute format
 */
export interface ItemAttribute {
    id: string;
    name: string;
    value: string | number | boolean;
    unit?: string;
    category?: string;
}

/**
 * Item location format
 */
export interface ItemLocation {
    address: {
        street: string;
        city: string;
        state: string;
        zipCode?: string;
        country: string;
    };
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

/**
 * Item subcomponent
 */
export interface ItemComponent {
    id: string;
    name: string;
    description?: string;
    status: ItemStatus;
    attributes?: ItemAttribute[];
}

/**
 * Item search criteria
 */
export interface ItemSearchCriteria {
    name?: string;
    types?: ItemType[];
    status?: ItemStatus[];
    tags?: string[];
    createdAfter?: string;
    createdBefore?: string;
    customFields?: Record<string, any>;
    sort?: {
        field: string;
        direction: 'asc' | 'desc';
    };
    page?: number;
    limit?: number;
}

/**
 * Item card props for display
 */
export interface ItemCardProps {
    item: Item;
    onClick?: (item: Item) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    isSelected?: boolean;
}
