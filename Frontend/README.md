# Credenz'26 - Unified Frontend
sssss
A unified production-ready frontend for Credenz'26, combining the 3D Landing Page and Main Website.

## Features

- 🎮 Immersive 3D Landing Page with Three.js
- 📱 Responsive Main Website with all event pages
- 🔐 Authentication system with protected routes
- 🛒 Cart and checkout functionality
- 📧 Contact and sponsor pages

## Prerequisites

- Node.js 18.x or higher
- npm or yarn

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
credenz26-unified/
├── public/                    # Static assets
│   ├── assets/               # Images and logos
│   ├── font/                 # Custom fonts
│   ├── textures/             # 3D textures
│   ├── models/               # 3D models (GLB files)
│   └── images/               # Page images
├── src/
│   ├── components/
│   │   ├── landing/          # 3D Landing page components
│   │   └── shared/           # Shared UI components (Header, Footer)
│   ├── pages/
│   │   ├── landing/          # Landing page
│   │   └── main/             # Main website pages
│   ├── context/              # React contexts
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Main app with routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Environment

The API proxy is configured to forward `/api` requests to `https://mainweb.credenz.co.in`

## Tech Stack

- React 18
- Vite
- Three.js / React Three Fiber
- Tailwind CSS
- React Router DOM
- Framer Motion
- GSAP
- Axios

## License

Private - PISB PICT
