# Implementation Plan

## 1. Component Structure
We will organize the codebase into modular React components:
- `src/components/layout/AdminLayout.tsx`: Wrapper for the dashboard, containing Sidebar, Header, and Main Content area.
- `src/components/layout/Sidebar.tsx`: Collapsible navigation menu.
- `src/components/layout/Header.tsx`: Top bar with user profile, theme toggle, and mobile menu trigger.
- `src/components/ui/Button.tsx`: Reusable button component with different variants.
- `src/components/ui/StatCard.tsx`: Dashboard statistic card with micro-animations.
- `src/pages/Dashboard.tsx`: Main landing page displaying stats and generic content.

## 2. Styling & Aesthetics
- **Framework**: Tailwind CSS v4.
- **Typography**: Import 'Inter' from Google Fonts in `index.css`.
- **Look & Feel**:
  - Light mode: Soft backgrounds (`bg-slate-50`), crisp white component backgrounds with light soft shadows, slate text colors.
  - Dark mode: Sleek deep backgrounds (`bg-slate-950`), component backgrounds (`bg-slate-900`), subtle borders (`border-slate-800`), avoiding pure black.
  - Interactions: Use `transition-all duration-300`, `hover:-translate-y-1`, `hover:shadow-md` for elements like StatCards and buttons.
  - Glassmorphism: Sticky header with `backdrop-blur-md bg-white/70` (and `bg-slate-950/70` in dark mode).

## 3. Tailwind Configuration (v4)
- Update `src/index.css` to configure the standard `dark:` variant to respond to a `.dark` class on the root element.
- Define theme variables and custom utilities if needed using Tailwind v4 `@theme` and `@custom-variant` syntax.

## 4. State Management Strategy (Dark Mode & UI)
- Utilize **Redux Toolkit** (already in `package.json`) to manage global UI state:
  - `theme`: 'light' | 'dark'
  - `isSidebarOpen`: true | false
- Create a `store/uiSlice.ts`.
- Persist the `theme` selection in `localStorage` so user preference is remembered.
- A `ThemeProvider` (or root `App.tsx` effect) will sync the Redux theme state to the `<html>` element's class list, enabling Tailwind's `dark:` classes.

## 5. Verification
- Start the development server.
- Use the provided frontend verification tools (Playwright) to capture screenshots at mobile (375px) and desktop (1440px) sizes.
- Verify both Light and Dark modes render correctly and look premium.
