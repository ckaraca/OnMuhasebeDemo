# Technical Context

## Architecture Overview

The Ön Muhasebe demo application is built as a modern single-page application (SPA) using React with TypeScript, following current best practices for maintainable and scalable web applications.

### Technology Stack

#### Frontend Core
- **React 18**: Latest React with concurrent features and improved performance
- **TypeScript 5.2**: Full type safety with latest language features
- **Vite 4.5**: Fast build tool with excellent development experience
- **React Router DOM 6.20**: Client-side routing with modern API

#### Styling & UI
- **Tailwind CSS 3.3**: Utility-first CSS framework with custom design system
- **Lucide React 0.294**: Consistent icon library with tree-shaking support
- **PostCSS**: CSS processing with autoprefixer for browser compatibility

#### State Management
- **Zustand 4.4**: Lightweight state management with minimal boilerplate
- **localStorage**: Browser-based persistence for demo data

#### Data Visualization
- **Chart.js 4.4**: Flexible charting library for dashboard analytics
- **react-chartjs-2 5.2**: React wrapper for Chart.js integration

#### Development Tools
- **ESLint 8.53**: Code linting with TypeScript support
- **Prettier 3.1**: Code formatting for consistent style
- **TypeScript ESLint**: TypeScript-specific linting rules

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout-specific components
│   │   ├── Layout.tsx  # Main application layout
│   │   ├── Sidebar.tsx # Navigation sidebar
│   │   └── TopBar.tsx  # Header with page title and actions
│   ├── ui/             # Basic UI building blocks
│   │   ├── Modal.tsx   # Reusable modal component
│   │   ├── Table.tsx   # Data table with sorting/filtering
│   │   └── Button.tsx  # Consistent button component
│   ├── CustomerModal.tsx    # Customer add/edit form
│   ├── InvoiceModal.tsx     # 3-step invoice wizard
│   └── SalesChart.tsx       # Dashboard chart component
├── lib/                # Utility functions and helpers
│   ├── storage.ts      # localStorage wrapper with error handling
│   ├── utils.ts        # Common utilities (formatting, validation)
│   └── mockData.ts     # Sample data for demonstration
├── pages/              # Page-level components
│   ├── Dashboard.tsx   # Main dashboard with KPIs and charts
│   ├── Customers.tsx   # Customer management interface
│   └── Invoices.tsx    # Invoice management with tabs
├── store/              # State management
│   └── index.ts        # Zustand store with all application state
├── types/              # TypeScript type definitions
│   └── index.ts        # All interfaces and types
├── App.tsx             # Root application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind directives
```

## Data Models

### Core Entities

#### Customer Interface
```typescript
interface Customer {
  id: string;              // Unique identifier
  name: string;            // Company name (Unvan)
  taxId: string;           // Turkish tax ID (10-11 digits)
  email: string;           // Contact email
  phone: string;           // Contact phone
  address: string;         // Full address
  balance: number;         // Current account balance
  lastInvoiceDate?: string; // ISO date string
  createdAt: string;       // Creation timestamp
  updatedAt: string;       // Last update timestamp
}
```

#### Invoice Interface
```typescript
interface Invoice {
  id: string;              // Unique identifier
  invoiceNo: string;       // Human-readable invoice number
  date: string;            // Invoice date (ISO string)
  customerId: string;      // Reference to customer
  customerName: string;    // Denormalized for display
  type: 'purchase' | 'sales'; // Invoice type
  items: InvoiceItem[];    // Line items array
  netTotal: number;        // Sum of line totals
  totalVat: number;        // Sum of VAT amounts
  grandTotal: number;      // Final total including VAT
  status: 'draft' | 'paid'; // Invoice status
  createdAt: string;       // Creation timestamp
  updatedAt: string;       // Last update timestamp
}
```

#### InvoiceItem Interface
```typescript
interface InvoiceItem {
  id: string;              // Unique identifier
  description: string;     // Product/service description
  quantity: number;        // Quantity ordered
  unitPrice: number;       // Price per unit
  vatRate: number;         // VAT percentage (0-100)
  lineTotal: number;       // quantity * unitPrice
  vatAmount: number;       // lineTotal * (vatRate / 100)
  grandTotal: number;      // lineTotal + vatAmount
}
```

## State Management Architecture

### Zustand Store Structure

The application uses a single Zustand store with the following structure:

```typescript
interface AppState {
  // Data
  customers: Customer[];
  invoices: Invoice[];
  
  // UI State
  isLoading: boolean;
  selectedCustomerId: string | null;
  selectedInvoiceId: string | null;
  
  // Actions - Customers
  loadCustomers: () => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Actions - Invoices
  loadInvoices: () => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  // Computed Values
  getDashboardStats: () => DashboardStats;
  getCustomerById: (id: string) => Customer | undefined;
  getInvoiceById: (id: string) => Invoice | undefined;
  getInvoicesByType: (type: 'purchase' | 'sales') => Invoice[];
}
```

### Data Persistence Strategy

- **localStorage Wrapper**: Custom utility class for safe localStorage operations
- **Automatic Persistence**: All state changes automatically saved to localStorage
- **Error Handling**: Graceful fallback when localStorage is unavailable
- **Mock Data**: Comprehensive seed data loaded on first application start

## Component Architecture

### Design Principles

#### Composition over Inheritance
- Small, focused components that do one thing well
- Higher-order components for cross-cutting concerns
- Render props and custom hooks for logic reuse

#### Props Interface Design
- Explicit prop types with TypeScript interfaces
- Optional props with sensible defaults
- Consistent naming conventions across components

#### State Management Patterns
- Local state for UI-only concerns (form inputs, modal visibility)
- Global state for shared data (customers, invoices)
- Computed values for derived state (totals, filtered lists)

### Key Component Patterns

#### Modal Components
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

#### Table Components
```typescript
interface Column {
  key: string;
  title: string;
  render?: (value: any, record: any) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (record: any) => void;
}
```

## Styling Architecture

### Tailwind CSS Configuration

Custom design system built on Tailwind CSS with:

- **Color Palette**: Professional blue primary color with semantic variants
- **Typography Scale**: Consistent font sizes and line heights
- **Spacing System**: 4px base unit with logical progression
- **Responsive Breakpoints**: Mobile-first with custom breakpoints
- **Component Classes**: Utility combinations for common patterns

### CSS Organization

- **Global Styles**: Base styles and Tailwind directives in `index.css`
- **Component Styles**: Tailwind utilities applied directly to components
- **Custom Components**: CSS classes for complex UI patterns (buttons, inputs, cards)
- **Responsive Design**: Mobile-first approach with progressive enhancement

## Performance Considerations

### Bundle Optimization
- **Tree Shaking**: Vite automatically removes unused code
- **Code Splitting**: React.lazy for route-based code splitting
- **Asset Optimization**: Automatic image and CSS optimization

### Runtime Performance
- **React 18 Features**: Concurrent rendering for better user experience
- **Memoization**: React.memo and useMemo for expensive calculations
- **Virtual Scrolling**: For large data tables (future enhancement)

### Development Experience
- **Hot Module Replacement**: Instant updates during development
- **TypeScript Integration**: Real-time type checking and IntelliSense
- **ESLint Integration**: Immediate feedback on code quality issues

## Security Considerations

### Input Validation
- **Client-side Validation**: Immediate feedback with TypeScript types
- **Sanitization**: Proper handling of user input to prevent XSS
- **Type Safety**: TypeScript prevents many runtime errors

### Data Handling
- **localStorage Security**: Appropriate for demo data, not sensitive information
- **No Authentication**: Demo application without user authentication
- **HTTPS Ready**: Application works with HTTPS in production

## Deployment Architecture

### Development Environment
- **Vite Dev Server**: Fast development with hot reload
- **Port Configuration**: Configurable port (default 3000)
- **Environment Variables**: Support for development/production configs

### Production Deployment
- **Static Build**: Generates optimized static files
- **CDN Ready**: Assets can be served from CDN
- **Replit Optimized**: Special configuration for Replit deployment

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **ES2020 Target**: Modern JavaScript features with appropriate polyfills
- **Progressive Enhancement**: Core functionality works without JavaScript

This file was created as part of a comprehensive cline memory bank for the Ön Muhasebe demo application.

