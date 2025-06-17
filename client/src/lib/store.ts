import { create } from 'zustand';
import { Customer, Invoice } from '@shared/schema';

interface AppState {
  // UI State
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Modal State
  isCustomerModalOpen: boolean;
  setCustomerModalOpen: (open: boolean) => void;
  editingCustomer: Customer | null;
  setEditingCustomer: (customer: Customer | null) => void;
  
  isInvoiceModalOpen: boolean;
  setInvoiceModalOpen: (open: boolean) => void;
  editingInvoice: Invoice | null;
  setEditingInvoice: (invoice: Invoice | null) => void;
  
  // Invoice wizard state
  currentInvoiceStep: number;
  setCurrentInvoiceStep: (step: number) => void;
  invoiceFormData: any;
  setInvoiceFormData: (data: any) => void;
  resetInvoiceWizard: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // UI State
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),
  
  // Modal State
  isCustomerModalOpen: false,
  setCustomerModalOpen: (open) => set({ isCustomerModalOpen: open }),
  editingCustomer: null,
  setEditingCustomer: (customer) => set({ editingCustomer: customer }),
  
  isInvoiceModalOpen: false,
  setInvoiceModalOpen: (open) => set({ isInvoiceModalOpen: open }),
  editingInvoice: null,
  setEditingInvoice: (invoice) => set({ editingInvoice: invoice }),
  
  // Invoice wizard state
  currentInvoiceStep: 1,
  setCurrentInvoiceStep: (step) => set({ currentInvoiceStep: step }),
  invoiceFormData: {},
  setInvoiceFormData: (data) => set({ invoiceFormData: data }),
  resetInvoiceWizard: () => set({ 
    currentInvoiceStep: 1, 
    invoiceFormData: {},
    isInvoiceModalOpen: false 
  }),
}));
