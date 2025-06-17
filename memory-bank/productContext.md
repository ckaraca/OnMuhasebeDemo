# Product Context

## Why This Project Exists

The Ön Muhasebe (Front Accounting) demo application was created to demonstrate a modern, full-stack accounting solution specifically designed for Turkish businesses. This project serves as a comprehensive example of how to build a professional business application with contemporary web technologies while addressing the specific needs of Turkish accounting practices.

### Primary Objectives
- **Demonstrate Modern Web Development**: Showcase React, TypeScript, and modern tooling in a real-world business context
- **Turkish Business Compliance**: Implement Turkish-specific business logic including tax ID validation and currency formatting
- **User Experience Excellence**: Create an intuitive interface that simplifies complex accounting workflows
- **Technical Architecture**: Establish patterns for scalable, maintainable business applications

## Problems It Solves

### For Turkish Businesses
- **Language Barrier**: Most accounting software is in English; this provides native Turkish interface
- **Local Compliance**: Handles Turkish tax ID formats (10-11 digits) and business requirements
- **Currency Handling**: Proper Turkish Lira formatting and calculations
- **User Experience**: Simplified workflows for common accounting tasks

### For Developers
- **Modern Stack Example**: Complete implementation using current best practices
- **TypeScript Integration**: Demonstrates type-safe development in business applications
- **Component Architecture**: Reusable UI components with consistent design system
- **State Management**: Practical Zustand implementation with localStorage persistence

### For Small Businesses
- **Immediate Usability**: No complex setup required, works immediately with sample data
- **Essential Features**: Covers core accounting needs without overwhelming complexity
- **Mobile Friendly**: Responsive design works on all devices
- **Cost Effective**: Demonstrates how modern web apps can replace expensive desktop software

## How It Should Work

### Core User Flows

#### Customer Management (Cari Yönetimi)
1. **View Customers**: Clean table view with key information (name, tax ID, balance, last invoice)
2. **Add Customer**: Simple form with validation for required business information
3. **Edit Customer**: In-place editing with immediate updates
4. **Delete Customer**: Confirmation dialog to prevent accidental deletion

#### Invoice Creation (Fatura Oluşturma)
1. **Step 1 - Basic Info**: Select customer, set invoice number and date, choose type (purchase/sales)
2. **Step 2 - Line Items**: Dynamic grid for adding products/services with real-time calculations
3. **Step 3 - Review**: Final review with totals before saving
4. **Save & Status**: Save as draft or mark as paid

#### Dashboard Analytics
1. **Quick Overview**: KPI cards showing key business metrics
2. **Visual Analytics**: Charts showing sales trends and performance
3. **Recent Activity**: Timeline of recent actions and changes

### Technical Behavior
- **Immediate Response**: All actions provide instant feedback
- **Data Persistence**: Changes saved automatically to localStorage
- **Error Handling**: Graceful error messages with recovery suggestions
- **Responsive Design**: Adapts to screen size from mobile to desktop

## User Experience Goals

### Primary UX Objectives

#### Simplicity
- **Minimal Cognitive Load**: Each screen focuses on one primary task
- **Progressive Disclosure**: Complex features revealed gradually
- **Clear Navigation**: Obvious paths between different sections
- **Consistent Patterns**: Similar actions work the same way throughout

#### Efficiency
- **Keyboard Shortcuts**: Common actions accessible via keyboard
- **Smart Defaults**: Forms pre-filled with sensible values
- **Bulk Operations**: Ability to perform actions on multiple items
- **Quick Access**: Frequently used features prominently placed

#### Reliability
- **Data Integrity**: Validation prevents invalid data entry
- **Error Prevention**: UI design prevents common mistakes
- **Recovery Options**: Easy undo/redo for accidental actions
- **Backup Awareness**: Clear indication of data persistence

#### Accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full functionality without mouse
- **Color Contrast**: Meets WCAG guidelines for readability
- **Touch Friendly**: Appropriate touch targets for mobile devices

### Specific UX Considerations

#### Turkish Business Context
- **Cultural Appropriateness**: Interface language and terminology familiar to Turkish users
- **Business Workflow**: Matches traditional Turkish accounting practices
- **Legal Compliance**: Supports Turkish tax and business regulations
- **Local Conventions**: Date formats, number formatting, and currency display

#### Professional Appearance
- **Clean Design**: Minimal, professional aesthetic appropriate for business use
- **Brand Consistency**: Cohesive visual identity throughout the application
- **Print Friendly**: Invoice layouts suitable for printing and PDF generation
- **Professional Typography**: Readable fonts appropriate for business documents

#### Performance Expectations
- **Fast Loading**: Application starts quickly with immediate interactivity
- **Smooth Interactions**: Animations and transitions feel responsive
- **Offline Capability**: Core functionality works without internet connection
- **Data Sync**: Clear indication of data save status and sync state

### Success Metrics

#### User Satisfaction
- **Task Completion Rate**: Users can complete common tasks without assistance
- **Error Rate**: Minimal user errors due to clear interface design
- **Learning Curve**: New users become productive quickly
- **Return Usage**: Users choose to continue using the application

#### Technical Performance
- **Load Time**: Application loads in under 3 seconds
- **Response Time**: User actions receive feedback within 100ms
- **Error Handling**: Graceful degradation when problems occur
- **Cross-browser Compatibility**: Consistent experience across modern browsers

This file was created as part of a comprehensive cline memory bank for the Ön Muhasebe demo application.

