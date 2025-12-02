import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CoffeeRecord, CoffeeFilter } from '../types/coffee';

interface CoffeeState {
  records: CoffeeRecord[];
  filters: CoffeeFilter;
  addRecord: (record: Omit<CoffeeRecord, 'id' | 'createdAt'>) => void;
  updateRecord: (id: string, updates: Partial<CoffeeRecord>) => void;
  deleteRecord: (id: string) => void;
  setFilters: (filters: CoffeeFilter) => void;
  clearFilters: () => void;
  getUniqueShops: () => string[];
  getUniqueFlavors: () => string[];
  getUniqueCupSizes: () => string[];
}

export const useCoffeeStore = create<CoffeeState>()(
  persist(
    (set, get) => ({
      records: [],
      filters: {},
      
      addRecord: (record) => {
        const newRecord: CoffeeRecord = {
          ...record,
          id: crypto.randomUUID(),
          createdAt: Date.now()
        };
        set((state) => ({
          records: [...state.records, newRecord]
        }));
      },
      
      updateRecord: (id, updates) => {
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id ? { ...record, ...updates } : record
          )
        }));
      },
      
      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id)
        }));
      },
      
      setFilters: (filters) => {
        set({ filters });
      },
      
      clearFilters: () => {
        set({ filters: {} });
      },
      
      getUniqueShops: () => {
        const shops = get().records.map((record) => record.shop);
        return [...new Set(shops)].sort();
      },
      
      getUniqueFlavors: () => {
        const flavors = get().records.map((record) => record.flavor);
        return [...new Set(flavors)].sort();
      },
      
      getUniqueCupSizes: () => {
        const cupSizes = get().records.map((record) => record.cupSize);
        return [...new Set(cupSizes)].sort();
      }
    }),
    {
      name: 'coffee-records-storage',
      version: 1
    }
  )
);

// 导出带有筛选功能的记录选择器
export const useFilteredRecords = () => {
  const records = useCoffeeStore((state) => state.records);
  const filters = useCoffeeStore((state) => state.filters);
  
  return records.filter((record) => {
    if (filters.shop && record.shop !== filters.shop) return false;
    if (filters.minPrice !== undefined && record.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && record.price > filters.maxPrice) return false;
    if (filters.flavor && record.flavor !== filters.flavor) return false;
    if (filters.cupSize && record.cupSize !== filters.cupSize) return false;
    return true;
  }).sort((a, b) => b.createdAt - a.createdAt);
};