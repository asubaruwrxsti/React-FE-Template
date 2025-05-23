# React TypeScript Application Template

A modern, responsive application template built with React, TypeScript, and TailwindCSS. This template provides a solid foundation for building enterprise-grade web applications with features like user management, content/item management, API integration, and responsive UI components.

## Features

- 📦 **Item Management**: Add, edit, and manage generic items with customizable attributes
- 👥 **User Management**: User authentication, registration, and profile management
- 🔐 **Authentication**: Secure authentication system with JWT and token refresh
- 🎨 **Theming**: Light/dark mode support with customizable theme
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop
- 🎯 **Accessibility**: ARIA-compliant components for better accessibility
- 🔄 **State Management**: Centralized app state management using Zustand
- 📊 **Data Visualization**: Customizable charts and data reporting components
- 📝 **Form Handling**: Type-safe form validation and submission

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **State Management**: Zustand (for app state)
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Shadcn/UI component system
- **Data Visualization**: Recharts
- **Animations**: Framer Motion
- **Routing**: React Router
- **API Client**: Custom fetch wrapper with authentication
- **Notifications**: Sonner toast notifications

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/react-typescript-template.git
cd react-typescript-template
```

2. Install dependencies
```bash
npm install
# or
yarn
# or
pnpm install
```

3. Set up environment variables
```bash
cp .env.template .env.local
```
Edit `.env.local` with your own values.

4. Start the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

## Project Structure

- `/src` - Source code
  - `/assets` - Static assets
  - `/components` - UI components
    - `/ui` - Base UI components
    - `/layouts` - Layout components
    - `/items` - Item management components
    - `/users` - User management components
    - `/dashboard` - Dashboard components
  - `/contexts` - React context providers
  - `/hooks` - Custom React hooks
  - `/lib` - Utility functions and constants
  - `/pages` - Page components
  - `/services` - API services
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions

## Customization

## Customization

### Theming

The template uses TailwindCSS for styling. You can customize the theme in the `tailwind.config.js` file.

### Environment Variables

The following environment variables are available:

- `VITE_API_URL` - API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version
- `VITE_APP_DESCRIPTION` - Application description

See `.env.template` for all available options.

### Feature Flags

The template includes a feature flag system that allows you to enable or disable features. You can configure feature flags in the `.env` file:

```
VITE_FEATURE_DARK_MODE=true
VITE_FEATURE_NOTIFICATIONS=true
VITE_FEATURE_EXPORT=true
VITE_FEATURE_BULK_ACTIONS=true
VITE_FEATURE_ADVANCED_FILTERS=true
VITE_FEATURE_DATA_VISUALIZATION=true
```

## Core Concepts

### Item Management

The template provides a generic "Item" model that can be extended to represent any type of entity in your application:

- Items have standard properties like id, name, description, type, status, etc.
- Custom attributes can be added to items through the attributes array or customFields object
- Items support tags, images, and related items

### User Management

The template includes a complete user management system:

- User registration and login
- Profile management
- Role-based access control (admin, manager, user, guest)
- User preferences (theme, notifications, language)

### Authentication

The template uses JWT for authentication with automatic token refresh:

- Secure storage of tokens in localStorage with encryption
- Automatic token refresh when expired
- Protected routes for authenticated users
- Redirect to login for unauthenticated users

### State Management

The template uses Zustand for state management:

- App-level state for global application state
- Feature-specific state stores for complex features
- Persistent state with localStorage integration

## Extending the Template

### Adding New Pages

1. Create a new file in `/src/pages`
2. Add the route to `/src/lib/constants.ts`

### Adding New Features

1. Create components for the feature in `/src/components/[feature]`
2. Create types in `/src/types`
3. Create services in `/src/services`
4. Add routes in `/src/lib/constants.ts`

### Customizing the Data Model

1. Update or extend the Item type in `/src/types/Item.ts`
2. Update the ItemService in `/src/services/item-service.ts`
3. Update UI components to display the new properties

## Deployment

This template can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Freact-typescript-template)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/react-typescript-template)

## Best Practices

- **Type Safety**: Always use TypeScript types and interfaces
- **Form Validation**: Use Zod schemas for form validation
- **Error Handling**: Use the error handling utilities for consistent error handling
- **API Requests**: Use the API client for all API requests
- **State Management**: Use Zustand for complex state management
- **Component Composition**: Use component composition for complex UIs
- **Responsive Design**: Always design for mobile-first
- **Accessibility**: Follow accessibility best practices

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Shadcn/UI](https://ui.shadcn.com/) for the UI components
- [TailwindCSS](https://tailwindcss.com/) for the styling
- [Vite](https://vitejs.dev/) for the build tool
- [React Router](https://reactrouter.com/) for routing
- [React Hook Form](https://react-hook-form.com/) for form handling
- [Zod](https://zod.dev/) for schema validation
- [Recharts](https://recharts.org/) for data visualization
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
- [Sonner](https://sonner.emilkowal.ski/) for toast notifications
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
