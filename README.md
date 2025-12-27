# Travel Article App

A modern web application for sharing and reading travel articles, built with React, TypeScript, and Vite. This project utilizes a feature-based architecture for scalability and maintainability.

## 🚀 Tech Stack

### Core

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

### Styling & UI

- **CSS Framework:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Scadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

### State Management & Data

- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)

### Forms & Validation

- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Validation:** [Zod](https://zod.dev/)

## 📂 Project Structure

The project follows a **Feature-Based Architecture**, grouping related logic (components, pages, services) by business features rather than technical types.

```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Shared components
│   ├── common/          # App-specific common components (e.g., ProtectedRoute)
│   ├── layout/          # Layout components (Navbar, Footer, Layout wrappers)
│   └── ui/              # Reusable UI primitives (Button, Input, Dialog, etc.)
├── features/            # Feature-specific modules
│   ├── articles/        # Article management feature
│   │   ├── components/  # Components specific to articles
│   │   └── pages/       # Pages specific to articles
│   └── auth/            # Authentication feature
│       └── pages/       # Login, Register pages
├── lib/                 # Library configurations (axios, utils)
├── pages/               # Top-level page exports (aggregating feature pages)
├── routes/              # Route definitions and configuration
├── schemas/             # Zod validation schemas
├── services/            # API service calls
├── stores/              # Global state stores (Zustand)
├── types/               # TypeScript type definitions
└── App.tsx              # Root component
```

## 📏 Naming Conventions

- **Files & Folders:**
  - Components: `PascalCase.tsx` (e.g., `ArticleCard.tsx`)
  - Hooks/Stores/Services: `camelCase.ts` (e.g., `useAuthStore.ts`, `article.service.ts`)
  - Utilities: `camelCase.ts` (e.g., `utils.ts`)
  - Types/Schemas: `kebab-case` or `camelCase` with suffix (e.g., `api.types.ts`, `article.schema.ts`)

- **Code:**
  - React Components: `PascalCase`
  - Functions/Variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Interfaces/Types: `PascalCase`

## 🛠️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd travel-article-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔍 Key Features

- **Authentication:** User registration and login with protected routes.
- **Article Management:** View, create, and manage travel articles.
- **Responsive Design:** Fully responsive UI using Tailwind CSS.
- **Form Validation:** Robust form handling with Zod schema validation.
- **Global State:** Efficient state management using Zustand.
- **AI Content Generation:** Generate engaging travel article descriptions using Google Gemini AI.
