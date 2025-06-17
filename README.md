# Ön Muhasebe - Turkish Accounting Web Application

A modern, full-stack accounting web application designed for Turkish businesses to manage customers, invoices, and financial operations. Built with React TypeScript and Express.js, featuring a clean interface with Turkish language support.

## 🚀 Features

### Core Functionality
- **Customer Management (Cari)**: Complete CRUD operations for business customers
- **Invoice Management (Faturalar)**: Support for both Purchase (Alış) and Sales (Satış) invoices
- **Dashboard Analytics**: Real-time KPIs with interactive charts
- **Multi-step Invoice Wizard**: Streamlined invoice creation process
- **Responsive Design**: Mobile-friendly interface that works on all devices

### Technical Features
- **Type-safe Development**: Full TypeScript implementation across frontend and backend
- **Real-time Updates**: Optimistic UI updates with automatic cache invalidation
- **Form Validation**: Comprehensive validation using Zod schemas
- **Modern UI Components**: Built with Radix UI primitives and Tailwind CSS
- **Turkish Business Logic**: Tax ID validation, Turkish date formatting, and currency display

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **TanStack React Query** for server state management
- **Zustand** for client-side state management
- **Tailwind CSS** with custom design system
- **Vite** for fast development and optimized builds

### Backend Stack
- **Express.js** with TypeScript
- **Drizzle ORM** configured for PostgreSQL (ready for database integration)
- **Zod** for runtime validation and type inference
- **In-memory storage** for development (easily switchable to PostgreSQL)

### Shared Layer
- **Centralized schemas** in `/shared` for type consistency
- **Unified validation** between frontend and backend
- **Type-safe API contracts**

## 📦 Installation & Setup

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Quick Start
1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd accounting-app
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Open your browser to `http://localhost:5000`
   - The app includes sample data for immediate exploration

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🗄️ Backend & Data Layer

### Current Implementation
The application currently uses **in-memory storage** (`MemStorage` class) for rapid development and testing. This provides:
- Immediate setup without database configuration
- Fast development cycles
- Sample data for feature demonstration

### Database Integration (Ready to Deploy)
The backend is architected with PostgreSQL in mind:

1. **Drizzle ORM Configuration**: Already set up in `drizzle.config.ts`
2. **Database Schemas**: Defined and ready in the storage interface
3. **Migration Ready**: Switch from `MemStorage` to PostgreSQL by:
   ```typescript
   // In server/storage.ts
   import { drizzle } from 'drizzle-orm/postgres-js'
   // Replace MemStorage with DrizzleStorage implementation
   ```

### API Endpoints
```
GET    /api/customers      - List all customers
POST   /api/customers      - Create new customer
GET    /api/customers/:id  - Get specific customer
PUT    /api/customers/:id  - Update customer
DELETE /api/customers/:id  - Delete customer

GET    /api/invoices       - List all invoices
POST   /api/invoices       - Create new invoice
GET    /api/invoices/:id   - Get specific invoice
PUT    /api/invoices/:id   - Update invoice
DELETE /api/invoices/:id   - Delete invoice
```

## 🎨 User Interface

### Design System
- **Primary Color**: Professional blue (`hsl(207, 90%, 54%)`)
- **Typography**: Inter font for excellent Turkish character support
- **Icons**: Lucide React for consistent iconography
- **Responsive Breakpoints**: Mobile-first design with desktop enhancements

### Key Components
- **Sidebar Navigation**: Fixed left navigation with collapsible mobile menu
- **Modal Dialogs**: Customer and invoice creation/editing
- **Data Tables**: Sortable, searchable tables with pagination
- **Dashboard Charts**: Interactive sales trends using Chart.js
- **Form Components**: Validated forms with real-time error handling

## 🔧 Configuration & Customization

### Environment Variables
Currently no environment variables are required for development. For production deployment:
```bash
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
PORT=5000
```

### Styling Customization
Colors and themes can be modified in:
- `client/src/index.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind configuration
- Component-level styling using Tailwind classes

## 📋 TODO & Future Enhancements

### High Priority
- [ ] **User Authentication System**
  - Login/logout functionality
  - Role-based access control (Admin, User, Viewer)
  - Session management
  - Password reset flow

- [ ] **PostgreSQL Integration**
  - Database migrations setup
  - Production data persistence
  - Backup and recovery procedures

- [ ] **Advanced Invoice Features**
  - PDF invoice generation
  - Email invoice delivery
  - Invoice templates
  - Recurring invoices

### Medium Priority
- [ ] **Financial Reporting**
  - Profit & loss statements
  - Balance sheet generation
  - Tax reporting for Turkish regulations
  - Export to Excel/PDF

- [ ] **Enhanced Dashboard**
  - Customizable widgets
  - Date range filtering
  - Advanced analytics
  - Real-time notifications

- [ ] **Multi-language Support**
  - English interface option
  - Internationalization (i18n) setup
  - Date/number formatting by locale

### Low Priority
- [ ] **Mobile Application**
  - React Native implementation
  - Offline capability
  - Push notifications

- [ ] **Integration APIs**
  - Banking integration
  - E-invoice system integration
  - Accounting software export

- [ ] **Advanced Features**
  - Inventory management
  - Project tracking
  - Time tracking integration

## 🔐 Authentication Strategy

### Planned Implementation
When authentication is added, the system will include:

1. **JWT-based Authentication**
   - Secure token-based sessions
   - Automatic token refresh
   - Logout on token expiry

2. **Role-Based Access Control**
   ```typescript
   enum UserRole {
     ADMIN = 'admin',     // Full system access
     USER = 'user',       // Standard operations
     VIEWER = 'viewer'    // Read-only access
   }
   ```

3. **Protected Routes**
   - Frontend route guards
   - Backend middleware protection
   - Redirect to login for unauthorized access

4. **User Management**
   - User registration/invitation
   - Profile management
   - Password policies

## 🚀 Deployment

### Replit Deployment (Recommended)
This application is optimized for Replit deployment:
1. The `Start application` workflow runs `npm run dev`
2. Automatic port configuration and SSL
3. Environment variable management through Replit secrets

### Manual Deployment
For other platforms:
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Start the production server

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow TypeScript best practices
2. **Components**: Use functional components with hooks
3. **Validation**: Always use Zod schemas for data validation
4. **State Management**: TanStack Query for server state, Zustand for client state
5. **Testing**: Write tests for critical business logic

### File Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and configurations
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data access layer
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
└── components.json         # shadcn/ui configuration
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support:
- Check the issues page for known problems
- Review the code comments for implementation details
- Refer to the architectural documentation in `replit.md`

---

**Built with ❤️ for Turkish businesses**