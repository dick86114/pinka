export interface CoffeeRecord {
  id: string;
  date: string;
  shop: string;
  name: string;
  price: number;
  capacity: string;
  flavor: string;
  cupSize: string;
  notes?: string;
  imageUrl?: string;
  createdAt: number;
}

export interface CoffeeFilter {
  shop?: string;
  minPrice?: number;
  maxPrice?: number;
  flavor?: string;
  cupSize?: string;
}