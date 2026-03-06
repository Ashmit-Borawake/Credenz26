# Performance Optimization Guide

## Changes Made for Better Load Times

### 1. **Code Splitting with Route-Based Lazy Loading**

- All page components are now lazy-loaded using React's `lazy()` and `Suspense`
- Only the landing page loads immediately; other pages load on-demand
- This reduces initial JavaScript bundle size significantly

### 2. **Model Loading Optimization**

- 3D models (ka_new.glb: 36MB, ka_new2.glb: 57MB) now preload after page load
- Delayed preloading prevents blocking initial page render
- Added material quality reduction for better performance

### 3. **Image Lazy Loading Utilities**

- Created `imageLoader.js` hook for lazy-loading images with IntersectionObserver
- Images load only when they become visible in the viewport
- Reduces initial image download and memory usage

### 4. **Build Optimizations**

- Updated `vite.config.js` with vendor code splitting
- Added terser minification with //console.log removal in production
- Separate chunks for: Three.js, React, and UI libraries

### 5. **Network & Resource Optimizations**

- Added DNS prefetch and preconnect to API server
- Enabled font display swap for faster font loading
- Disabled console logging in production

### 6. **3D Model Optimizations**

- Reduced envMapIntensity from 0.5 to 0.3
- Disabled shadow casting on meshes
- Enabled frustum culling
- Optimized material rendering

## File Structure of New Utilities

```
src/utils/
├── modelLoader.js      # 3D model caching and lazy loading
├── imageLoader.js      # Image lazy-loading components and hooks
├── performance.js      # Performance monitoring and utilities
├── api.js              # (existing) API calls
└── auth.js             # (existing) Authentication
```

## How to Use New Features

### Lazy Load Images

```jsx
import { LazyImage } from "./utils/imageLoader";

<LazyImage
  src="/images/large-image.jpg"
  alt="Description"
  placeholder="/images/placeholder.jpg"
/>;
```

### Monitor Performance

Check browser console after page loads for performance metrics:

- Page Load Time
- DOM Ready Time
- Core Web Vitals (LCP, FID)

## Further Optimization Tips

### 1. **Image Compression**

Large image files (7MB, 4MB) should be compressed:

```bash
# Using ImageMagick
convert image.jpg -quality 80 image-optimized.jpg

# Or use online tools like TinyPNG
```

### 2. **3D Model Compression**

For huge models (36MB, 57MB):

- Use glTF tools to compress GLB files
- Consider splitting models into parts
- Use LOD (Level of Detail) versions

### 3. **Enable GZIP Compression**

On your server, ensure GZIP is enabled for assets.

### 4. **CDN for Images**

Use a CDN like Cloudflare or AWS CloudFront for image delivery.

### 5. **Browser Caching**

Set appropriate cache headers for static assets.

## Monitoring Load Times

The app now logs performance metrics. Open browser DevTools console to see:

```
⚡ Performance Metrics:
  Page Load Time: 3245ms
  DOM Ready Time: 2100ms
  Connect Time: 450ms
  Render Time: 800ms
```

## Build & Deploy

```bash
# Development
npm run dev

# Production Build (with optimizations)
npm run build

# Preview build
npm run preview
```

## Expected Improvements

- **Initial Load**: 30-50% faster (lazy-loaded pages)
- **First Paint**: Immediate (lighter initial bundle)
- **Model Loading**: 1-2 seconds delay (non-blocking)
- **Image Loading**: Progressive (on viewport visibility)

---

**Note**: The 97MB of 3D models will always take time to download. The optimizations above make the loading non-blocking and progressive, improving perceived performance.
