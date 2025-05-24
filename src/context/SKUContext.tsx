import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Branch, SKU, StockAdjustment, StockTransfer, ReorderAlert } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface SKUContextType {
  // Branch Management
  branches: Branch[];
  addBranch: (branch: Omit<Branch, 'id'>) => void;
  
  // SKU Management
  skus: SKU[];
  addSKU: (sku: Omit<SKU, 'id' | 'isActive' | 'currentStock' | 'reservedStock' | 'branchStock'>) => void;
  deactivateSKU: (id: string) => void;
  searchSKUs: (query: string) => SKU[];
  
  // Stock Management
  adjustStock: (adjustment: Omit<StockAdjustment, 'id' | 'date'>) => void;
  transferStock: (transfer: Omit<StockTransfer, 'id' | 'date'>) => void;
  getStockLevel: (skuId: string, branchId?: string) => number;
  
  // Alerts
  reorderAlerts: ReorderAlert[];
}

const SKUContext = createContext<SKUContextType | undefined>(undefined);

export const SKUProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [reorderAlerts, setReorderAlerts] = useState<ReorderAlert[]>([]);

  const addBranch = (branch: Omit<Branch, 'id'>) => {
    const newBranch = { ...branch, id: uuidv4() };
    setBranches([...branches, newBranch]);
  };

  const addSKU = (sku: Omit<SKU, 'id' | 'isActive' | 'currentStock' | 'reservedStock' | 'branchStock'>) => {
    const newSKU: SKU = {
      ...sku,
      id: uuidv4(),
      isActive: true,
      currentStock: 0,
      reservedStock: 0,
      branchStock: {},
      reorderThreshold: 10
    };
    setSKUs([...skus, newSKU]);
  };

  const deactivateSKU = (id: string) => {
    setSKUs(skus.map(sku => 
      sku.id === id ? { ...sku, isActive: false } : sku
    ));
  };

  const searchSKUs = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return skus.filter(sku => 
      sku.name.toLowerCase().includes(lowercaseQuery) ||
      sku.code.toLowerCase().includes(lowercaseQuery) ||
      sku.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const adjustStock = (adjustment: Omit<StockAdjustment, 'id' | 'date'>) => {
    setSKUs(skus.map(sku => {
      if (sku.id === adjustment.skuId) {
        const newStock = sku.currentStock + adjustment.quantity;
        if (newStock < sku.reorderThreshold) {
          setReorderAlerts([...reorderAlerts, {
            skuId: sku.id,
            currentStock: newStock,
            threshold: sku.reorderThreshold,
            date: new Date().toISOString()
          }]);
        }
        return { ...sku, currentStock: newStock };
      }
      return sku;
    }));
  };

  const transferStock = (transfer: Omit<StockTransfer, 'id' | 'date'>) => {
    setSKUs(skus.map(sku => {
      if (sku.id === transfer.skuId) {
        const updatedBranchStock = { ...sku.branchStock };
        updatedBranchStock[transfer.sourceLocation] = (updatedBranchStock[transfer.sourceLocation] || 0) - transfer.quantity;
        updatedBranchStock[transfer.destinationLocation] = (updatedBranchStock[transfer.destinationLocation] || 0) + transfer.quantity;
        return { ...sku, branchStock: updatedBranchStock };
      }
      return sku;
    }));
  };

  const getStockLevel = (skuId: string, branchId?: string) => {
    const sku = skus.find(s => s.id === skuId);
    if (!sku) return 0;
    if (branchId) {
      return sku.branchStock[branchId] || 0;
    }
    return sku.currentStock;
  };

  return (
    <SKUContext.Provider value={{
      branches,
      addBranch,
      skus,
      addSKU,
      deactivateSKU,
      searchSKUs,
      adjustStock,
      transferStock,
      getStockLevel,
      reorderAlerts
    }}>
      {children}
    </SKUContext.Provider>
  );
};

export const useSKU = () => {
  const context = useContext(SKUContext);
  if (context === undefined) {
    throw new Error('useSKU must be used within a SKUProvider');
  }
  return context;
}; 