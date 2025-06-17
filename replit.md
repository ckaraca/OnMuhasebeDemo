# Replit.md - Turkish Accounting Web Application

## Overview

This is a modern full-stack web application built for Turkish businesses to manage their accounting operations. It's designed as a demo accounting system ("Ön Muhasebe") that handles customer management, invoice creation, and provides dashboard analytics with Turkish language support.

The application follows a monorepo structure with a React frontend and Express.js backend, connected through a shared schema layer. It uses TypeScript throughout for type safety and includes a comprehensive UI component library based on shadcn/ui.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for global state, TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: Custom component library based on Radix UI primitives and shadcn/ui
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Data Layer**: Drizzle ORM configured for PostgreSQL
- **API Design**: RESTful endpoints with Zod validation
- **Development**: Hot reload with Vite integration

### Shared Layer
- **Schema**: Centralized Zod schemas for data validation and TypeScript types
- **Type Safety**: Shared types between frontend and backend ensure consistency

## Key Components

### Data Models
The application manages three core entities:

1. **Customers (Cari)**: Turkish businesses with tax ID validation, contact information, and account balances
2. **Invoices (Faturalar)**: Both purchase (Alış) and sales (Satış) invoices with line items
3. **Invoice Items**: Individual line items with quantity, unit price, and VAT calculations

### Pages and Features
- **Dashboard**: KPI overview with charts showing sales trends and business metrics
- **Customer Management**: Full CRUD operations with search and filtering
- **Invoice Management**: Separate views for purchase and sales invoices with a multi-step wizard for creation
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar

### UI Components
- Comprehensive component library with consistent styling
- Modal dialogs for data entry and editing
- Data tables with search, filtering, and pagination
- Form components with validation and error handling
- Toast notifications for user feedback

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack React Query
2. **API Layer**: Express.js routes handle requests with Zod validation
3. **Data Storage**: Currently uses in-memory storage with seed data (MemStorage class)
4. **Database Ready**: Drizzle ORM configuration prepared for PostgreSQL migration
5. **Response Handling**: Structured error handling and toast notifications

The application uses optimistic updates and automatic cache invalidation for responsive user experience.

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL adapter (ready for database integration)
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **zustand**: Client state management
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **chart.js**: Data visualization
- **react-hook-form**: Form state management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution
- **esbuild**: Production bundling

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development
- Run command: `npm run dev`
- Uses Vite dev server with HMR on port 5000
- Express server serves API routes and static files in development

### Production Build
- Build command: `npm run build`
- Creates optimized client bundle in `dist/public`
- Bundles server code with esbuild for Node.js runtime

### Environment
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Deployment Target**: Autoscale
- **Port Configuration**: Internal 5000, External 80

The storage layer is abstracted through the IStorage interface, making it easy to switch from in-memory storage to PostgreSQL when needed.

## Changelog

```
Changelog:
- June 17, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```