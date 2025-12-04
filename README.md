# POS & WMS System - Enterprise Retail Management

A professional-grade Point of Sale and Warehouse Management System built with Next.js, React, TypeScript, and Supabase. This is a commercial-ready SaaS solution for retail operations.

## Features

### POS Module
- Cashier interface with product search and autocomplete
- Dynamic shopping cart with quantity management
- Multiple payment methods (Cash, QRIS, Bank Transfer)
- Auto-calculated totals with configurable tax
- Transaction history and daily summaries

### WMS Module
- Stock In (Goods Received) operations
- Stock Out (Goods Issued) with reason tracking
- Inter-warehouse stock transfers
- Real-time inventory summary with low-stock alerts
- Complete stock movement history with filtering

### Product Management
- Full CRUD operations for products
- SKU management and barcode support
- Category organization
- Cost and selling price tracking

### Dashboard & Analytics
- Real-time sales metrics and KPIs
- Charts and visualizations (Line charts, Pie charts)
- Payment method breakdowns
- Recent transaction activity
- Revenue and profit tracking

### Authentication & Security
- Supabase Auth integration
- Role-based access control (Super Admin, Manager, Cashier, Warehouse Staff)
- Row-level security for data protection
- Session management

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Backend**: Next.js API Routes, Vercel Serverless
- **Charts**: Recharts
- **Authentication**: Supabase Auth

## Project Structure

\`\`\`
├── app/
│   ├── dashboard/          # Dashboard module
│   ├── pos/                # POS cashier interface
│   ├── products/           # Product management
│   ├── inventory/          # WMS inventory
│   ├── settings/           # Configuration
│   ├── auth/               # Authentication
│   └── api/                # API routes
├── components/
│   ├── layout/             # Sidebar navigation
│   ├── dashboard/          # Dashboard components
│   ├── pos/                # POS components
│   ├── wms/                # WMS components
│   └── ui/                 # shadcn UI components
├── lib/
│   ├── db/                 # Database clients
│   └── types/              # TypeScript types
├── scripts/
│   └── 01-schema.sql       # Database schema
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Local Development

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd pos-wms-system
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Setup environment variables**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your Supabase credentials:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

4. **Setup database**
- Go to Supabase SQL editor
- Run the SQL from `scripts/01-schema.sql`

5. **Start development server**
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Products
- `GET /api/products/list` - List all products
- `POST /api/products/create` - Create product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### POS
- `POST /api/pos/create-order` - Create sales order
- `GET /api/pos/today-summary` - Daily sales summary

### Inventory
- `POST /api/inventory/stock-in` - Stock in operation
- `POST /api/inventory/stock-out` - Stock out operation
- `POST /api/inventory/transfer` - Transfer between warehouses
- `GET /api/inventory/summary` - Inventory summary
- `GET /api/inventory/movements` - Movement history

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
\`\`\`bash
git push origin main
\`\`\`

2. **Connect to Vercel**
- Go to vercel.com
- Import your GitHub repository
- Add environment variables
- Deploy

3. **Post-deployment**
- Update Supabase redirect URL
- Test all integrations
- Monitor logs

## User Roles

- **Super Admin**: Full system access, can manage users and settings
- **Store Manager**: View analytics, manage products and inventory
- **Cashier**: POS operations, limited dashboard access
- **Warehouse Staff**: Stock management, inventory operations

## Performance Optimizations

- Server-side rendering with Next.js RSC
- Database indexing on frequently queried columns
- Optimized API routes with error handling
- Client-side caching with localStorage
- Image optimization

## Security

- Row-level security (RLS) on Supabase tables
- Input validation on all API endpoints
- Secure password hashing with Supabase Auth
- CSRF protection
- Environment variable management

## Troubleshooting

### Authentication Issues
- Check Supabase credentials in `.env.local`
- Verify user exists in Supabase Auth
- Check browser cookies for auth tokens

### Database Connection
- Verify database URL is correct
- Check network connectivity
- Review Supabase service status

### API Errors
- Check server logs
- Verify request payload format
- Check database permissions

## Support

For support, open an issue in the repository or contact support@example.com.

## License

Commercial license - All rights reserved

---

**Last Updated**: December 2025
**Version**: 1.0.0
