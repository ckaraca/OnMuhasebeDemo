import { create } from 'zustand';
import { type Customer } from '@shared/schema';

interface AppState {
  isCustomerModalOpen: boolean;
  setCustomerModalOpen: (open: boolean) => void;
  editingCustomer: Customer | null;
  setEditingCustomer: (customer: Customer | null) => void;

  isInvoiceModalOpen: boolean;
  setInvoiceModalOpen: (open: boolean) => void;

  currentInvoiceStep: number;
  setCurrentInvoiceStep: (step: number) => void;
  resetInvoiceWizard: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isCustomerModalOpen: false,
  setCustomerModalOpen: (open) => set({ isCustomerModalOpen: open }),
  editingCustomer: null,
  setEditingCustomer: (customer) => set({ editingCustomer: customer }),

  isInvoiceModalOpen: false,
  setInvoiceModalOpen: (open) => set({ isInvoiceModalOpen: open }),

  currentInvoiceStep: 1,
  setCurrentInvoiceStep: (step) => set({ currentInvoiceStep: step }),
  resetInvoiceWizard: () => set({
    currentInvoiceStep: 1,
    isInvoiceModalOpen: false,
  }),
}));
