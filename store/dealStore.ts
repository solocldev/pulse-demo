import { toast } from 'sonner';
import { create } from 'zustand';

export interface Deal {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl: string;
  industry: string;
  dealSize: string;
  contactPerson: string;
  contactEmail: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewDeal = Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>;

interface DealStore {
  deals: Deal[];
  isLoading: boolean;
  error: string | null;
  fetchDeals: () => Promise<void>;
  createDeal: (deal: NewDeal) => Promise<Deal>;
  updateDeal: (id: string, deal: Partial<NewDeal>) => Promise<Deal>;
  deleteDeal: (id: string) => Promise<void>;
  getDealById: (id: string) => Deal | undefined;
}

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useDealStore = create<DealStore>((set, get) => ({
  deals: [],
  isLoading: false,
  error: null,

  fetchDeals: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await delay(800);
      // For the demo, we'll just use the existing deals in the store
      // In a real app, you would fetch from an API
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while fetching deals',
      });
      toast.error('Failed to load deals');
    }
  },

  createDeal: async (newDeal: NewDeal) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await delay(800);

      const deal: Deal = {
        ...newDeal,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set((state) => ({
        deals: [...state.deals, deal],
        isLoading: false,
      }));

      toast.success('Deal created successfully');
      return deal;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while creating the deal',
      });
      toast.error('Failed to create deal');
      throw error;
    }
  },

  updateDeal: async (id: string, updatedDeal: Partial<NewDeal>) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await delay(800);

      let updated: Deal | undefined;

      set((state) => {
        const deals = state.deals.map((deal) => {
          if (deal.id === id) {
            updated = {
              ...deal,
              ...updatedDeal,
              updatedAt: new Date(),
            };
            return updated;
          }
          return deal;
        });

        return { deals, isLoading: false };
      });

      if (!updated) {
        throw new Error('Deal not found');
      }

      toast.success('Deal updated successfully');
      return updated;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while updating the deal',
      });
      toast.error('Failed to update deal');
      throw error;
    }
  },

  deleteDeal: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await delay(800);

      set((state) => ({
        deals: state.deals.filter((deal) => deal.id !== id),
        isLoading: false,
      }));

      toast.success('Deal deleted successfully');
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while deleting the deal',
      });
      toast.error('Failed to delete deal');
      throw error;
    }
  },

  getDealById: (id: string) => {
    return get().deals.find((deal) => deal.id === id);
  },
}));
