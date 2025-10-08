# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 14 demo application showcasing ASUS gaming laptops with TypeScript, App Router, and MongoDB integration. The app includes Home, Shop, Contact pages, user location tracking, and a product catalog system.

## Common Development Commands

### Development Server
```bash
npm run dev
```
Starts development server at http://localhost:3000

### Build and Production
```bash
npm run build    # Build for production
npm start       # Start production server
```

### Code Quality
```bash
npm run lint    # Run ESLint with Next.js config
```

### Single Component Testing
```bash
# Test specific page routes directly:
# http://localhost:3000 - Home page
# http://localhost:3000/shop - Shop page  
# http://localhost:3000/contact - Contact form
# http://localhost:3000/zephyrus - Product detail page
# http://localhost:3000/user-data - User data page
```

## Architecture Overview

### App Router Structure
- **App Router**: Uses Next.js 14 App Router (`app/` directory)
- **Layout System**: Root layout wraps all pages with `RequireUserData` component
- **API Routes**: RESTful endpoints in `app/api/` for contact forms and user data
- **Components**: Reusable UI components in `app/components/`
- **Data Layer**: Static product data in `app/data/products.ts`

### Key Architectural Patterns

#### Location-Based User Experience
- **RequireUserData Component**: Wrapper that enforces location permission before app access
- **Client-Side Storage**: User data persisted in localStorage with MongoDB backup
- **Geolocation Integration**: Real-time location tracking with fallback handling
- **Progressive Enhancement**: App works with JavaScript disabled for basic functionality

#### Database Integration
- **MongoDB Connection**: Singleton pattern in `lib/mongodb.ts` with development caching
- **Environment-Based Config**: Different connection strategies for dev/prod
- **TLS Configuration**: Corporate proxy-friendly settings with certificate validation bypass

#### Image Handling
- **Next.js Image Optimization**: Configured for multiple external domains (Unsplash, Cloudflare, ASUS CDN)
- **Mixed Assets**: Local images in root directory, external SVGs for product models
- **Remote Patterns**: Whitelist for `images.unsplash.com`, `dlcdnwebimgs.asus.com`, `rog.asus.com`

### Critical Dependencies
- **Next.js 14.2.4**: Core framework with App Router
- **MongoDB Driver**: Database connectivity with ServerAPI v1
- **TypeScript**: Strict type checking enabled
- **React 18**: Latest React features

## Environment Setup

### Required Environment Variables
```bash
MONGODB_URI=mongodb+srv://[credentials]@[cluster]/?retryWrites=true&w=majority&appName=[appname]
```

### Development Prerequisites
1. Node.js (compatible with Next.js 14)
2. MongoDB Atlas connection or local MongoDB instance
3. Location permissions enabled in browser for full functionality

## Key Files to Understand

- `app/layout.tsx` - Root layout with RequireUserData wrapper
- `app/components/RequireUserData.tsx` - Location permission and user data management
- `lib/mongodb.ts` - Database connection with development optimizations  
- `app/data/products.ts` - Product catalog data structure
- `next.config.js` - Image domain configurations for external assets