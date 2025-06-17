# System Patterns

## Design Patterns and Conventions

This document outlines the recurring design patterns, coding conventions, and architectural decisions that have emerged during the development of the Ön Muhasebe demo application.

## Code Organization Patterns

### Feature-Based Structure
```
src/
├── components/
│   ├── layout/          # Layout-specific components
│   ├── ui/              # Reusable UI primitives
│   └── [FeatureModal].tsx # Feature-specific components
├── pages/               # Route-level components
├── lib/                 # Utility functions
├── store/               # State management
└── types/               # Type definitions
```

**Rationale**: Groups related functionality together, making it easier to locate and maintain code. UI primitives are separated from feature-specific components for better reusability.

### Import Organization
```typescript
// External libraries (React, third-party)
import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';

// Internal utilities and types
import { useAppStore } from '../store';
import { Customer } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';

// Components (UI primitives first, then feature components)
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import CustomerModal from '../components/CustomerModal';
```

**Convention**: Imports are organized in logical groups with blank lines between groups for better readability.

## Component Design Patterns

### Composition Pattern
```typescript
// Base Modal component
const Modal: React.FC<ModalProps> = ({ children, ...props }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
};

// Specialized CustomerModal
const CustomerModal: React.FC<CustomerModalProps> = ({ customer, ...props }) => {
  return (
    <Modal title={customer ? 'Edit Customer' : 'Add Customer'} {...props}>
      <CustomerForm customer={customer} />
    </Modal>
  );
};
```

**Pattern**: Build complex components by composing simpler ones. This promotes reusability and maintains single responsibility principle.

### Props Interface Pattern
```typescript
interface ComponentProps {
  // Required props first
  data: DataType[];
  onAction: (item: DataType) => void;
  
  // Optional props with defaults
  loading?: boolean;
  emptyText?: string;
  size?: 'sm' | 'md' | 'lg';
  
  // Event handlers grouped together
  onClick?: (event: MouseEvent) => void;
  onSubmit?: (data: FormData) => void;
}
```

**Convention**: Props are organized by importance and type, with clear TypeScript interfaces for all components.

### Render Props Pattern
```typescript
interface TableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], record: T) => React.ReactNode;
  }>;
}

// Usage
<Table
  data={customers}
  columns={[
    {
      key: 'balance',
      title: 'Balance',
      render: (value: number) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(value)}
        </span>
      ),
    },
  ]}
/>
```

**Pattern**: Flexible rendering through render functions allows customization without component modification.

## State Management Patterns

### Zustand Store Pattern
```typescript
interface StoreSlice {
  // State
  items: Item[];
  selectedId: string | null;
  
  // Actions
  loadItems: () => void;
  addItem: (item: CreateItemData) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  setSelected: (id: string | null) => void;
  
  // Computed values
  getItemById: (id: string) => Item | undefined;
  getFilteredItems: (filter: FilterType) => Item[];
}
```

**Pattern**: Each entity has consistent CRUD operations plus selection state and computed values.

### Optimistic Updates Pattern
```typescript
const addCustomer = (customerData: CreateCustomerData) => {
  const newCustomer: Customer = {
    ...customerData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Optimistic update
  const customers = [...get().customers, newCustomer];
  set({ customers });
  
  // Persist to storage
  LocalStorage.set(STORAGE_KEYS.CUSTOMERS, customers);
};
```

**Pattern**: Update UI immediately, then persist data. Provides responsive user experience.

### Computed Values Pattern
```typescript
const getDashboardStats = (): DashboardStats => {
  const { customers, invoices } = get();
  
  return {
    totalCustomers: customers.length,
    totalInvoices: invoices.length,
    outstandingBalance: customers.reduce((sum, customer) => sum + customer.balance, 0),
    todaysSales: invoices
      .filter(inv => inv.type === 'sales' && isToday(inv.date))
      .reduce((sum, invoice) => sum + invoice.grandTotal, 0),
  };
};
```

**Pattern**: Derive state from base state rather than storing computed values separately.

## Form Handling Patterns

### Controlled Components Pattern
```typescript
const [formData, setFormData] = useState<FormData>({
  name: '',
  email: '',
  phone: '',
});

const handleChange = (field: keyof FormData, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  
  // Clear error when user starts typing
  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }
};

// Usage
<input
  value={formData.name}
  onChange={(e) => handleChange('name', e.target.value)}
/>
```

**Pattern**: Single source of truth for form state with immediate error clearing for better UX.

### Validation Pattern
```typescript
const validateForm = (): boolean => {
  const newErrors: FormErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  }

  if (!validateEmail(formData.email)) {
    newErrors.email = 'Valid email is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

**Pattern**: Centralized validation with clear error messages and TypeScript type safety.

## Styling Patterns

### Tailwind Component Classes
```css
@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50;
  }
  
  .btn-primary {
    @apply btn bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4;
  }
  
  .input {
    @apply flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2;
  }
}
```

**Pattern**: Create component classes for commonly used utility combinations.

### Conditional Styling Pattern
```typescript
const getStatusBadge = (status: string) => {
  const statusConfig = {
    draft: { label: 'Taslak', className: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'Ödendi', className: 'bg-green-100 text-green-800' },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};
```

**Pattern**: Use configuration objects for conditional styling to maintain consistency and readability.

### Responsive Design Pattern
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
</div>

<div className="hidden md:block">
  {/* Only show on tablet and desktop */}
</div>

<div className="block md:hidden">
  {/* Only show on mobile */}
</div>
```

**Pattern**: Mobile-first responsive design with progressive enhancement.

## Error Handling Patterns

### Safe Operations Pattern
```typescript
export class LocalStorage {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }
}
```

**Pattern**: Wrap potentially failing operations with try-catch and provide sensible fallbacks.

### User Confirmation Pattern
```typescript
const handleDelete = (customer: Customer) => {
  if (window.confirm(`"${customer.name}" müşterisini silmek istediğinizden emin misiniz?`)) {
    deleteCustomer(customer.id);
  }
};
```

**Pattern**: Always confirm destructive actions with clear, contextual messages.

## Data Transformation Patterns

### Calculation Pattern
```typescript
export const calculateInvoiceItem = (
  quantity: number,
  unitPrice: number,
  vatRate: number
) => {
  const lineTotal = quantity * unitPrice;
  const vatAmount = lineTotal * (vatRate / 100);
  const grandTotal = lineTotal + vatAmount;
  
  return {
    lineTotal: Number(lineTotal.toFixed(2)),
    vatAmount: Number(vatAmount.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
  };
};
```

**Pattern**: Pure functions for calculations with proper rounding to avoid floating-point errors.

### Formatting Pattern
```typescript
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateString));
};
```

**Pattern**: Use Intl API for locale-aware formatting to ensure proper Turkish language support.

## Performance Patterns

### Memoization Pattern
```typescript
const ExpensiveComponent: React.FC<Props> = React.memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveCalculation(item),
    }));
  }, [data]);

  return <div>{/* Render processed data */}</div>;
});
```

**Pattern**: Use React.memo and useMemo for expensive operations and prevent unnecessary re-renders.

### Event Handler Pattern
```typescript
const TableRow: React.FC<Props> = ({ record, onEdit, onDelete }) => {
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(record);
  }, [record, onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(record);
  }, [record, onDelete]);

  return (
    <tr onClick={() => onRowClick(record)}>
      <td>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
};
```

**Pattern**: Use useCallback for event handlers to prevent unnecessary re-renders and properly handle event propagation.

This file was created as part of a comprehensive cline memory bank for the Ön Muhasebe demo application.

