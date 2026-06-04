# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for PPI AIU (Perhimpunan Pelajar Indonesia at Albukhary International University) - an Indonesian student association website with bilingual support (Indonesian/English) and admin content management system.

**Live Features:**
- Public pages: Home, About, Members Directory, Blog/Activities, Foundation Documents
- Admin dashboard with CRUD operations for members, blog posts, and documents
- Bilingual UI with automatic browser language detection and localStorage persistence
- Responsive design with maroon (#800020) brand color

## Tech Stack

- **Frontend**: React 18.3.1 + TypeScript
- **Routing**: React Router v7 (Data Router pattern with `createBrowserRouter`)
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **Icons**: Lucide React
- **Animations**: Motion/React (formerly Framer Motion)
- **UI Components**: Radix UI primitives + custom components in `components/ui/`
- **Backend (Future)**: Supabase (PostgreSQL + Auth + Storage) - currently mock data
- **Build Tool**: Vite 6.3.5
- **Package Manager**: pnpm

## Commands

```bash
# Install dependencies (always use pnpm, not npm)
pnpm install

# Build for production
pnpm build

# Note: Development server is auto-running in Make/Figma environment
# Do NOT run `vite` or `npm run dev` manually
```

## Architecture & Key Patterns

### 1. Routing Architecture (React Router v7)

Uses Data Router pattern with `createBrowserRouter` in `src/app/routes.tsx`:

```tsx
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,  // Shared layout with nav/footer
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "members", Component: Members },
      { path: "blog", Component: Blog },
      { path: "blog/:id", Component: BlogDetail },
      { path: "foundation", Component: Foundation },
      { path: "login", Component: Login },
      { path: "admin", Component: AdminDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
```

All routes render inside `<Layout>` which provides navigation and footer.

### 2. Internationalization (i18n)

**Language Context** (`src/app/contexts/LanguageContext.tsx`):
- Detects browser language on first load via `navigator.language`
- Persists user preference in `localStorage`
- Provides `useLanguage()` hook with `{ language, setLanguage, t }` where `t` is the translation object

**Translation Structure** (`src/app/i18n/translations.ts`):
```typescript
export const translations = {
  id: { /* Indonesian translations */ },
  en: { /* English translations */ }
}
```

**Usage Pattern**:
```tsx
import { useLanguage } from "../contexts/LanguageContext";

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  return <h1>{t.home.hero.title}</h1>;
}
```

**Translation keys are nested by page/section**: `t.home.hero.title`, `t.about.vision.visionTitle`, etc.

### 3. Styling System (Tailwind v4)

**Theme Definition** (`src/styles/theme.css`):
- Uses CSS custom properties: `--primary: #800020` (maroon), `--secondary: #f5f5f5`, etc.
- Tailwind classes reference these: `bg-primary`, `text-primary-foreground`
- Dark mode support via `.dark` class (though not actively used)

**Font Imports** (`src/styles/fonts.css`):
- **IMPORTANT**: All font imports MUST go in `fonts.css` only, never in other CSS files
- Always add new font imports at the TOP of the file

**Component Styling**:
- Use inline Tailwind classes for most styling
- Base styles for `<h1>`, `<h2>`, etc. defined in theme.css `@layer base`
- Tailwind utility classes always override base styles

### 4. Data Management

**Current State**: Mock data in component state or `src/app/data/blogPosts.ts`

**Admin Dashboard Pattern**:
- Uses `localStorage` for auth state (demo credentials: admin@ppi-aiu.org / admin123)
- Forms in `src/app/components/` handle add/edit operations
- Data structures:
  ```typescript
  // Members: Hierarchical by year
  interface YearData {
    year: string;
    group_photo_url: string;
    members: Member[];  // Flat structure, each member has division field
  }
  
  // Blog posts
  interface BlogPost {
    id: string;
    title: string;
    content: string;
    image_url: string;
    date: string;
  }
  ```

**Future Migration**: See `DATABASE_SCHEMA.md` for Supabase schema when integrating real backend.

### 5. Image Handling

**Figma Imports**: Images from Figma are in `src/imports/` directory
- Raster images: Use `import img from "figma:asset/[hash].png"` (virtual module, no path prefix)
- SVGs: Use relative imports `import svg from "../imports/svg-[id]"`
- Always import images, never use string paths directly

**Unsplash Images**: Used for placeholder content (member photos, group photos)
- Pattern: `https://images.unsplash.com/photo-[id]?w=[width]`

**User Uploads in Forms**:
- Use FileReader API to convert to base64 data URLs
- Validate file type (`file.type.startsWith("image/")`) and size (max 5MB)
- Store as `image_url` field (string)

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/                      # Radix UI + shadcn-style components
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx  # Fallback for broken images
│   │   ├── Layout.tsx               # Nav, footer, language toggle
│   │   ├── BlogPostForm.tsx         # Add/edit blog posts
│   │   ├── MemberForm.tsx           # Add/edit members
│   │   └── YearForm.tsx             # Add new board year
│   ├── contexts/
│   │   └── LanguageContext.tsx      # i18n state management
│   ├── data/
│   │   └── blogPosts.ts             # Mock blog data
│   ├── i18n/
│   │   └── translations.ts          # ID/EN translations
│   ├── pages/
│   │   ├── Home.tsx                 # Landing page with hero
│   │   ├── About.tsx                # Vision/mission/timeline
│   │   ├── Members.tsx              # Hierarchical directory (year → division → member)
│   │   ├── Blog.tsx                 # Article list
│   │   ├── BlogDetail.tsx           # Single article view
│   │   ├── Foundation.tsx           # AD/ART & GBHO documents with preview
│   │   ├── Login.tsx                # Admin login
│   │   ├── AdminDashboard.tsx       # CRUD dashboard
│   │   └── NotFound.tsx             # 404 page
│   ├── routes.tsx                   # React Router config
│   └── App.tsx                      # Root with LanguageProvider
├── styles/
│   ├── theme.css                    # Tailwind theme vars (maroon/white/black)
│   └── fonts.css                    # Font imports ONLY
└── imports/                         # Figma-imported assets
```

## Important Conventions

### Language Translation Updates

When adding new UI text:
1. Add translation keys to BOTH `translations.id` and `translations.en` in `i18n/translations.ts`
2. Use nested structure matching page hierarchy: `t.pageName.section.key`
3. Update ALL pages that use hardcoded text to use translation keys

### Members Directory Pattern

Two-level navigation:
1. **Year accordion** → Shows group photo
2. **Click group photo** → Shows division list with individual members
3. **Division accordion** → Shows member cards with photos

State management: `viewMode: "group" | "members"` toggles between group photo and member list.

### Admin Forms

All forms use controlled inputs with `formData` state:
```tsx
const [formData, setFormData] = useState<FormType>(initialState);
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
```

Image uploads convert to base64 immediately on file selection.

### Video Embeds

- **YouTube**: Use iframe embed with `https://www.youtube.com/embed/[VIDEO_ID]`
- **Instagram Reels**: Use iframe with `https://www.instagram.com/reel/[REEL_ID]/embed`
- Never use `<video>` tag for external content

## Make/Figma Environment Constraints

**DO NOT**:
- Create or modify `index.html` or `__figma__entrypoint__.ts` (auto-generated)
- Run `vite build` or `npm run dev` (dev server auto-starts)
- Tell users to open `localhost` URLs (they can't access it)
- Create `.html`, `.js`, or `.jsx` files (use `.tsx` only)

**DO**:
- Edit `src/app/App.tsx` as main entrypoint (must have default export)
- Use `pnpm` instead of `npm` for package management
- Import components with relative paths from `./components/`
- Use the preview surface for testing (not localhost)

## Design System

**Brand Colors**:
- Primary: `#800020` (maroon) - `bg-primary`, `text-primary`
- Secondary: `#f5f5f5` (light gray) - `bg-secondary`
- Accent: `#000000` (black) - `text-foreground`

**Typography**: Default font stack from Tailwind, custom fonts imported in `fonts.css`

**Spacing**: Tailwind default scale (4px base unit)

**Components**: Pre-built UI components in `components/ui/` using Radix UI primitives

## Testing Admin Features

Demo credentials for admin dashboard:
- Email: `admin@ppi-aiu.org`
- Password: `admin123`

Login stores `isAuthenticated` in `localStorage`.

## Future Development (Supabase Integration)

See `DATABASE_SCHEMA.md` and README.md section "Pengembangan Selanjutnya" for:
- Real authentication with Supabase Auth
- Database CRUD operations
- Image storage with Supabase Storage buckets
- RLS policies for security

Current code is structured to easily migrate from localStorage/mock data to Supabase.
