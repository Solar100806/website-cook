# Next.js 16 Base Project Structure

This is a **reusable base structure** for Next.js projects. Contains only framework-agnostic boilerplate code that can be used across multiple projects.

## 📁 Directory Structure

```
frontend/
├── public/                      # Static assets
│   ├── icons/
│   └── images/
│
├── src/
│   ├── app/                     # Next.js 16 App Router
│   │   ├── (routes)/           # Grouped routes (add your routes here)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── providers.tsx
│   │
│   ├── components/              # React components (organized by type)
│   │   ├── shared/             # Reusable UI components
│   │   ├── forms/              # Form components
│   │   ├── layouts/            # Layout components
│   │   ├── features/           # Feature-specific components
│   │   └── ui/                 # Base UI library components
│   │
│   ├── lib/                     # Core utilities
│   │   ├── api-client.ts       # HTTP client with auth support
│   │   ├── http.ts             # Fetch utilities with timeout
│   │   ├── queryClient.ts      # React Query setup
│   │   └── validations.ts      # Zod schema templates
│   │
│   ├── utils/                   # Helper functions
│   │   ├── common.ts           # Common utilities (cn, delay, isEmpty, etc.)
│   │   ├── logger.ts           # Logging utility
│   │   └── errors.ts           # Error handling classes
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts          # Auth context hook
│   │   └── index.ts
│   │
│   ├── server/                  # Server-side utilities
│   │   └── auth.ts             # Cookie & token management
│   │
│   ├── store/                   # State management
│   │   ├── AuthContext.tsx     # Auth context (implement as needed)
│   │   └── index.ts
│   │
│   ├── config/                  # Configuration
│   │   └── app.config.ts       # Centralized app config from env vars
│   │
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts            # Generic types (ApiResponse, PaginatedResponse, AuthState)
│   │
│   ├── constants/               # Application constants
│   │   └── app.ts              # Generic constants (ROLES, TIME, PAGINATION)
│   │
│   ├── services/               # API services (add as needed)
│   │   └── [create your services here]
│   │
│   ├── api/                    # Next.js API routes (if needed)
│   │   └── [add routes here]
│   │
│   ├── styles/                 # Additional stylesheets
│   │   └── [add as needed]
│   │
│   └── middleware.ts           # Next.js request middleware
│
├── Configuration Files
│   ├── .env.example            # Environment variables template
│   ├── .env.local              # (git ignored) Your env values
│   ├── .eslintrc.json          # ESLint configuration
│   ├── .prettierrc              # Prettier code formatting
│   ├── .gitignore
│   ├── next.config.js          # Next.js configuration
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   ├── postcss.config.mjs      # PostCSS configuration
│   ├── tsconfig.json           # TypeScript configuration
│   ├── package.json            # Dependencies & scripts
│   └── README.md               # Project documentation
```

## 🎯 What's Included (Reusable Base)

### ✅ Core Setup

- Next.js 16 with App Router
- TypeScript 5
- Tailwind CSS 4 with PostCSS
- ESLint & Prettier configuration
- Git ignore rules

### ✅ HTTP & API

- **`lib/api-client.ts`** - HTTP client with authentication
- **`lib/http.ts`** - Fetch utilities with timeout handling
- **Generic types** for responses (no project-specific types)

### ✅ Configuration

- **`config/app.config.ts`** - Centralized config from env vars
- **Environment variables** template
- Generic constants (roles, time intervals, pagination defaults)

### ✅ Utilities

- **`utils/common.ts`** - Common helpers (cn, delay, isEmpty, deepClone, getErrorMessage)
- **`utils/logger.ts`** - Development logging
- **`utils/errors.ts`** - Custom error classes (ApiError, ValidationError)

### ✅ State & Hooks

- **`hooks/useAuth.ts`** - Hook for AuthContext
- **`server/auth.ts`** - Cookie & token management
- **`store/`** - Ready for AuthContext or similar implementations

### ✅ Data Fetching

- **`lib/queryClient.ts`** - React Query configuration
- **Generic type definitions** for API responses

### ✅ Authentication

- **`middleware.ts`** - Template for protected routes
- **Server-side auth utilities** in `/server/auth.ts`
- **Cookie handling** for tokens

## 🚀 How to Extend

### 1. Add Project-Specific Types

```typescript
// src/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// src/types/product.ts
export interface Product {
  id: string;
  title: string;
  price: number;
}
```

### 2. Create API Services

```typescript
// src/services/user.service.ts
import { apiClient } from '@/lib/api-client';

export const userService = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
};

// src/services/product.service.ts
export const productService = {
  getAll: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
};
```

### 3. Create Custom Hooks

```typescript
// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });
}
```

### 4. Create Routes

```typescript
// src/app/(routes)/products/page.tsx
import { useProducts } from '@/hooks/useProducts';

export default function ProductsPage() {
  const { data } = useProducts();
  return <div>{/* Your page */}</div>;
}
```

### 5. Add Project Constants

```typescript
// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PROFILE: '/profile',
};

// src/constants/api.ts
export const API_ENDPOINTS = {
  USERS: '/users',
  PRODUCTS: '/products',
};
```

## 📦 Tech Stack

- **Framework**: Next.js 16
- **React**: 19
- **TypeScript**: 5
- **Styling**: Tailwind CSS 4
- **UI Library**: Ant Design 6 (optional)
- **State Management**: Zustand 5 (if needed)
- **Data Fetching**: React Query (TanStack Query) 5
- **Forms**: React Hook Form 7 (if needed)
- **Validation**: Zod 4
- **Icons**: Ant Design Icons (optional)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## 🗂️ File Organization Best Practices

1. **Components**: Group by feature or type (shared, forms, layouts, features)
2. **Services**: One service per domain (user.service.ts, product.service.ts)
3. **Hooks**: Custom hooks for specific logic (useProducts.ts, useUser.ts)
4. **Types**: Keep types close to where they're used or in generic types file
5. **Constants**: Separate by domain (routes.ts, api.ts, app.ts)

## 📝 Notes

- This is a **minimalist base** - no specific business logic
- **No project-specific code** included (services, constants beyond generic ones)
- Ready to extend with your application logic
- All files are templates that can be modified

---

Generated: 2026
