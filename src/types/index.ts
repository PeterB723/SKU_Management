export interface Branch {
  id: string;
  name: string;
  location: string;
  contactDetails: string;
}

export interface SKU {
  id: string;
  name: string;
  code: string;
  category: string;
  subcategory: string;
  brandName: string;
  isActive: boolean;
  currentStock: number;
  reservedStock: number;
  reorderThreshold: number;
  branchStock: Record<string, number>;
}

export interface StockAdjustment {
  id: string;
  skuId: string;
  quantity: number;
  reason: string;
  date: string;
}

export interface StockTransfer {
  id: string;
  skuId: string;
  sourceLocation: string;
  destinationLocation: string;
  quantity: number;
  date: string;
}

export interface ReorderAlert {
  skuId: string;
  currentStock: number;
  threshold: number;
  date: string;
} 