export type ProductCategory = 'Jersey' | 'Trinket' | 'Cap' | 'Pants' | 'Practice' | 'Patch';

export interface Product {
  sku: string;
  category: ProductCategory;
  teamId: string | null;
  displayName: string;
  description: string;
  basePrice: number | null;
  sizesAvailable: string[];
  imageUrl: string;
  displayOrder: number;
}
