# Codebase Analysis: react-video-editor

## Overview
The `react-video-editor` is a sophisticated web-based video editing application built with Next.js. It leverages the `@designcombo` ecosystem and `Remotion` for video rendering and editing capabilities. The application features a rich, responsive interface with a timeline, scene editor, and various media controls.

## Tech Stack

### Core Frameworks & Languages
-   **Framework:** Next.js 15.3.2 (App Router)
-   **Language:** TypeScript
-   **Package Manager:** PNPM
-   **Styling:** Tailwind CSS 4, Motion (Framer Motion), `lucide-react` icons.

### Video & Editing
-   **@designcombo/\***: A suite of packages for resizing, timeline, state management, and transitions.
-   **Remotion:** Used for video playback (`@remotion/player`) and rendering (`@remotion/renderer`).

### State Management
-   **Zustand:** primary state management library.
-   **@designcombo/state:** Specialized state management for the design/canvas area.
-   **Context:** React Context is likely used for some global providers.

### Backend & API
-   **API Routes:** Next.js API routes at `src/app/api`.
-   **Database:** Postgres with `kysely` query builder.
-   **Features:**
    -   `render`: Video rendering services.
    -   `transcribe`: Audio transcription.
    -   `uploads`: File handling.
    -   `pexels`: Stock media integration.
    -   `voices`: Text-to-speech services.

### UI Components
-   **Component Primitives:** `@radix-ui/*` (Dialog, Popover, Slider, etc.).
-   **UI Library:** Unnamed, likely custom or based on `shadcn/ui` (suggested by `components.json`).
-   **Notifications:** `sonner`.
-   **Drawers:** `vaul`.

## Project Structure (`src/`)

### `app/`
-   **Next.js App Router**: Contains the application routes.
-   `page.tsx`: Home page, renders the `<Editor />` component.
-   `api/`: Backend API endpoints (`render`, `transcribe`, `uploads`, etc.).

### `features/editor/`
This is the core of the application.
-   **components/**:
    -   `timeline/`: Timeline visualization and interaction.
    -   `player/`: Video player wrapper.
    -   `scene/`: The main canvas/preview area.
    -   `control-item/` & `menu-item/`: Sidebar and control panels.
-   **store/**: Zustand stores for managing editor state (`use-store.ts`, `use-scene-store.ts`, etc.).
-   **hooks/**: Custom hooks for editor logic (e.g., `use-timeline-events`).
-   `editor.tsx`: The main orchestration component that composes the editor UI.

### `components/`
-   Shared UI components (Buttons, Inputs, Dialogs, etc.) used across the app.

### `lib/` & `utils/`
-   Utility functions and configurations.

## Key Observations
1.  **SPA-like Architecture**: The app heavily relies on the `/` route which loads the full editor.
2.  **Complex State**: The editor manages complex state for timeline, canvas, and media items using a combination of Zustand and `@designcombo/state`.
3.  **Responsive Design**: The editor has specific logic for large vs. small screens (desktop vs. mobile layouts).
4.  **Modular Feature Design**: The `editor` feature is self-contained, promoting clean separation of concerns.
