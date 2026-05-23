# Food App - Frontend

Modern Next.js 16 application with TypeScript, Tailwind CSS, and React Query.

## � Quick Start

1. Install dependencies:

```bash
npm install
```

2. Setup environment:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Start development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- **Framework**: Next.js 16
- **React**: 19
- **TypeScript**: 5
- **Styling**: Tailwind CSS 4
- **UI Library**: Ant Design 6
- **State Management**: Zustand + React Context
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **Validation**: Zod

## 📁 Project Structure

```
src/
├── app/              # App Router (routes & layouts)
├── components/       # React components (shared, forms, layouts, features, ui)
├── lib/              # Utilities & config (api-client, http, queryClient, validations)
├── utils/            # Helper functions (common, logger, errors)
├── hooks/            # Custom React hooks
├── server/           # Server-side functions (auth utilities)
├── store/            # State management (AuthContext)
├── services/         # API services (create as needed)
├── constants/        # App constants
├── types/            # TypeScript types
├── config/           # Configuration
├── api/              # API routes (if needed)
├── styles/           # Global styles
└── middleware.ts     # Next.js middleware
```

## 🛠 Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔐 Environment Variables

See `.env.example` for available variables.
