# Active Context

## Current Work Focus

Demo front-accounting web application (Ön Muhasebe) development completed. The application is a fully functional React TypeScript application with Vite, Tailwind CSS, and Zustand for state management. All core features have been implemented including customer management, invoice creation with 3-step wizard, and dashboard analytics.

## Recent Changes

- **Project Setup**: Complete Vite + React + TypeScript + Tailwind CSS configuration
- **Data Layer**: Implemented TypeScript interfaces for Customer, Invoice, and InvoiceItem with localStorage persistence
- **Layout Components**: Created responsive sidebar navigation, top bar, and main layout structure
- **Customer Management**: Built complete CRUD operations with modal forms and validation
- **Invoice Management**: Implemented 3-step wizard with real-time calculations and tabbed interface
- **Dashboard**: Added KPI cards, Chart.js integration for monthly sales visualization
- **State Management**: Zustand store with computed values and localStorage integration
- **UI Components**: Reusable Modal, Table, Button components with Tailwind styling
- **Mock Data**: Comprehensive seed data for immediate demonstration

## Next Steps

- **Testing**: Local browser testing to verify all functionality works correctly
- **Deployment**: Optional deployment to production environment
- **Documentation**: Complete README with setup and usage instructions
- **Enhancements**: Potential additions like PDF generation, email functionality, or database integration

## Active Decisions and Considerations

### Technology Choices Made
- **Zustand over Redux**: Chosen for simpler state management with less boilerplate
- **localStorage over Database**: For demo purposes, allows immediate functionality without backend setup
- **Chart.js over Recharts**: Better Turkish language support and more customization options
- **Lucide React Icons**: Consistent iconography with good tree-shaking support
- **Tailwind CSS**: Utility-first approach for rapid UI development with custom design system

### UI/UX Decisions
- **Turkish Language**: All interface text in Turkish for authentic business application feel
- **3-Step Invoice Wizard**: Breaks complex invoice creation into manageable steps
- **Responsive Design**: Mobile-first approach with 375px minimum width support
- **Real-time Calculations**: Immediate feedback on invoice totals and VAT calculations
- **Modal-based Forms**: Overlay forms for better user experience and context preservation

## Important Patterns and Preferences

### Code Organization
- **Feature-based Structure**: Components organized by functionality (layout, ui, pages)
- **Type Safety**: Comprehensive TypeScript interfaces for all data models
- **Utility Functions**: Centralized helpers for formatting, validation, and calculations
- **Component Composition**: Reusable UI components with consistent prop interfaces

### Styling Patterns
- **Tailwind Utilities**: Consistent spacing, colors, and responsive design
- **Custom CSS Classes**: Component-level styles for complex UI elements
- **Color System**: Professional blue primary color with semantic color naming
- **Typography**: Clean, readable fonts with proper hierarchy

### State Management Patterns
- **Zustand Store**: Single store with feature-based slices
- **Computed Values**: Derived state for dashboard statistics and calculations
- **localStorage Sync**: Automatic persistence of all application data
- **Optimistic Updates**: Immediate UI updates with error handling

## Learnings and Project Insights

### Technical Insights
- **Vite Performance**: Excellent development experience with fast hot reload
- **TypeScript Benefits**: Caught multiple potential runtime errors during development
- **Tailwind Productivity**: Rapid UI development with consistent design system
- **Component Reusability**: Well-designed base components enable quick feature development

### Business Logic Insights
- **Turkish Tax ID Validation**: 10-11 digit validation for business compliance
- **Currency Formatting**: Turkish Lira formatting with proper locale support
- **Invoice Calculations**: Complex VAT calculations with rounding considerations
- **Date Handling**: Turkish date formatting and timezone considerations

### User Experience Insights
- **Progressive Disclosure**: Step-by-step forms reduce cognitive load
- **Immediate Feedback**: Real-time validation and calculations improve user confidence
- **Responsive Design**: Mobile-friendly interface essential for business applications
- **Data Persistence**: localStorage provides good demo experience without backend complexity

### Development Process Insights
- **Mock Data Strategy**: Comprehensive seed data enables immediate feature testing
- **Component-First Development**: Building reusable components first speeds up feature development
- **Type-Driven Development**: Defining interfaces first provides clear development direction
- **Incremental Feature Building**: Each module built independently enables parallel development

This file was created as part of a comprehensive cline memory bank for the Ön Muhasebe demo application.

