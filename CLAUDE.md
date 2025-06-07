# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture Overview

### Core Technology Stack
- **Next.js 15** with App Router for server-side rendering and routing
- **React 19** with strict mode enabled
- **NextAuth.js v4** for credential-based authentication
- **Google Sheets API** as the backend data store via `googleapis`
- **React Context API** for global state management

### Authentication Architecture
- Uses environment variables for credential validation (`CREDENTIAL_USERNAME`, `CREDENTIAL_PASSWORD`)
- JWT tokens with `NEXTAUTH_SECRET` for session management
- Route protection via middleware that secures `/` and `/order/*` routes
- Custom login page at `/login`

### Data Layer Architecture
- **Google Sheets as Database**: All order and product data stored in Google Sheets
- **External API Integration**: Products fetched from `NEXT_PUBLIC_PRODUCT_API_URL`
- **Two Data Contexts**:
  - `OrdersContext`: Simple state container for order data
  - `ProductsContext`: Auto-fetching context with loading states and refresh capability

### Key Application Patterns

#### State Management Pattern
- Global state managed through React Context providers in `app/providers.jsx`
- Orders and Products contexts provide data throughout the component tree
- ProductsContext includes automatic data fetching and manual refresh functionality

#### API Route Pattern
- `/api/updateStatus.js` - Updates order completion status in Google Sheets
- `/api/updateBarcode.js` - Updates product barcode information in Google Sheets
- Authentication handled via NextAuth API routes at `/api/auth/[...nextauth].js`

#### Performance Optimizations
- Uses `react-window` and `react-virtualized-auto-sizer` for large list virtualization
- Image optimization configured for `cdn.shopify.com` domain in Next.js config

#### Route Structure
- App Router with nested layouts
- Dynamic routes: `/order/[orderId]` and `/products/[sku]`
- Route protection enforced by middleware for sensitive pages

### Environment Variables Required
- `NEXTAUTH_SECRET` - JWT signing secret
- `CREDENTIAL_USERNAME` - Admin login username
- `CREDENTIAL_PASSWORD` - Admin login password  
- `NEXT_PUBLIC_PRODUCT_API_URL` - External product API endpoint
- Google Sheets API credentials for backend data operations

### Data Flow Architecture
1. **Authentication**: Credential validation → JWT token → Protected route access
2. **Order Management**: Google Sheets → OrdersContext → Order picking interface
3. **Product Management**: External API → ProductsContext → Product catalog
4. **Status Updates**: UI actions → API routes → Google Sheets backend

### Key Business Logic
- Order picking workflow with barcode scanning validation
- Real-time status tracking from pending to completed orders
- Product catalog management with barcode updates
- Multi-platform order aggregation (Shopee, Lazada, Shopify, TikTok)