# California Legal Petition Auto-Filler

## Overview

This application is a California legal forms automation platform that allows users to auto-fill Judicial Council petitions using uploaded documents and smart questionnaires. The system provides an anonymous, user-friendly interface for generating legal documents such as divorce petitions (FL-100), probate forms, and other California court forms. The application operates with a wizard-based approach that guides users through form selection, document upload, data entry, and final document generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React and TypeScript, utilizing a modern component-based architecture. The UI leverages shadcn/ui components with Radix UI primitives for accessible and consistent design patterns. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management. Tailwind CSS provides utility-first styling with custom design tokens for legal-themed colors and typography.

### Backend Architecture
The server is implemented as an Express.js application with TypeScript support. The backend follows a RESTful API pattern with route handlers organized in a modular structure. The application uses a storage abstraction layer (IStorage interface) with an in-memory implementation for development, allowing for easy migration to persistent database solutions. Session-based anonymous user tracking enables form persistence without requiring user accounts.

### Database Design
The schema defines four core entities using Drizzle ORM with PostgreSQL dialect:
- **Petition Forms**: Stores form metadata, field definitions, and judicial council form specifications
- **Form Submissions**: Tracks user form progress and submitted data with session-based identification
- **User Profiles**: Maintains anonymous user profile data for form pre-filling
- **Generated Documents**: Stores metadata about completed PDF documents

The database design supports dynamic form fields through JSONB columns, enabling flexible form structures without schema changes.

### Document Processing Pipeline
The application implements a multi-stage document processing workflow:
1. **Upload Stage**: Accepts multiple file formats with size validation and categorization
2. **OCR Processing**: Extracts text from uploaded documents for auto-filling capabilities
3. **Smart Form Generation**: Uses extracted data to pre-populate form fields
4. **PDF Generation**: Creates official court documents using pdf-lib with proper formatting

### State Management
The frontend employs a wizard-based state machine with five distinct steps:
1. Form Selection
2. Document Upload  
3. Smart Questionnaire
4. Review & Generate
5. Download

State persistence occurs at the session level, allowing users to resume incomplete forms. The application uses React Query for server state caching and synchronization.

### Authentication Strategy
The system operates on anonymous session-based tracking using UUID session identifiers stored in localStorage. This approach provides form persistence without requiring user registration, maintaining privacy while enabling multi-session workflows.

## External Dependencies

### Core Technologies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Node.js web framework for API server
- **TypeScript**: Type safety across frontend and backend
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support
- **Vite**: Development server and build tool with hot module replacement

### UI Framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible component foundations for dialogs, forms, and navigation
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography

### State and Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form validation and submission handling
- **Zod**: Runtime type validation and schema parsing

### Document Processing
- **pdf-lib**: PDF creation and manipulation library
- **Multer**: File upload middleware for Express
- **date-fns**: Date manipulation and formatting utilities

### Database and Storage
- **@neondatabase/serverless**: PostgreSQL serverless database client
- **Drizzle Kit**: Database migrations and schema management
- **connect-pg-simple**: PostgreSQL session store for Express

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **PostCSS**: CSS processing with Tailwind integration