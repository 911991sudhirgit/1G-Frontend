export type ListingType = 'SALE' | 'RENT';
export type PropertyType = 'HOUSE' | 'APARTMENT' | 'LAND' | 'COMMERCIAL';
export type PropertyStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface PropertyImage {
  id?: number;
  imageUrl: string;
  caption?: string;
  displayOrder?: number;
}

export interface Property {
  id: number;
  title: string;
  description?: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  amenities?: string;
  status?: PropertyStatus;
  ownerId?: number;
  ownerName?: string;
  isPremium?: boolean;
  premiumExpiresAt?: string;
  images?: PropertyImage[];
  viewCount?: number;
  clickCount?: number;
  visitCount?: number;
  createdAt?: string;
  featured?: boolean;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
