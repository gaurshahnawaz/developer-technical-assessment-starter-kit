export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  status: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Land {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: number;
  zoning: string;
  images: string[];
  status: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  developer: string;
  totalUnits: number;
  availableUnits: number;
  startingPrice: number;
  images: string[];
  status: string;
  amenities: string[];
  completionDate: string;
  createdAt: string;
  updatedAt: string;
}
