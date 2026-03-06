# Credenz'26 🔥⚡
### Official Website for Credenz'26 — The Flagship Event of PICT IEEE Student Branch

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=threedotjs&logoColor=white" />
</p>

<p align="center">
  <strong>🌐 Live at <a href="https://credenz.co.in" target="_blank">credenz.co.in</a></strong>
</p>

---

## ✨ Features

- 🎭 **Immersive 3D Landing Page** — Built with Three.js & WebGL fire particle effects that stay in GPU memory for instant transitions
- 🔐 **Secure Authentication** — JWT-based auth with OTP email verification, password reset via Nodemailer & bcrypt hashing
- 🎫 **Event Management** — Browse all Credenz events with detailed pages, categories, and dynamic content
- 🛒 **Cart & Checkout System** — Add events to cart, checkout seamlessly, and receive confirmation
- 🪪 **Digital Event Passes** — Auto-generated passes upon successful registration
- 👤 **User Profiles** — Manage account details, view registered events and passes
- 🛡️ **Admin Panel** — Role-based access control for event creation and management
- 📧 **Email Notifications** — Automated emails via SMTP for OTP and registration confirmations
- 🚀 **Performance Optimized** — Lazy-loaded routes, code splitting, Terser minification
- 🛡️ **Production-Grade Security** — Helmet.js headers, CORS policy, rate limiting (100 req/15min)
- 📊 **Analytics** — Vercel Analytics integration for real-time traffic insights

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS v4 |
| **3D & Animation** | Three.js, @react-three/fiber, @react-three/drei, GSAP, Framer Motion |
| **Backend** | Node.js 20, Express 5, TypeScript 5 |
| **Database** | PostgreSQL (Neon serverless), Prisma ORM |
| **Authentication** | JWT, bcryptjs, cookie-parser |
| **Email** | Nodemailer (SMTP / Gmail) |
| **Validation** | Zod |
| **Security** | Helmet.js, express-rate-limit, CORS |
| **DevOps** | Docker, Docker Compose, Vercel (Frontend) |
| **Analytics** | Vercel Analytics |

---

## 📁 Project Structure

```
Credenz26/
├── Frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── landing/    # 3D Landing page
│   │   │   └── main/       # Events, Cart, Checkout, Profile, Auth...
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context & Protected routes
│   │   └── utils/          # Axios helpers & utilities
│   └── vite.config.js
│
└── Backend/                # Express + TypeScript API
    ├── src/
    │   ├── routes/         # auth, event, cart, pass, order, profile, admin, feedback
    │   ├── controllers/    # Business logic per route
    │   ├── middlewares/    # JWT auth, role-based admin guard
    │   ├── utils/          # Email sender, OTP generator, helpers
    │   └── index.ts        # Entry point
    ├── prisma/             # Prisma schema & migrations
    ├── Dockerfile
    └── docker-compose.yml
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 20+
- PostgreSQL database (or [Neon](https://neon.tech) serverless)
- Gmail App Password (for email OTP)

### 1. Clone the Repository

```bash
git clone https://github.com/Ashmit-Borawake/Credenz26.git
cd Credenz26
```

### 2. Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Configure environment variables
cp .env.sample .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
PORT=3000
JWT_SECRET=your_super_secret_jwt_key
OTP_EXPIRATION=300

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_app_password
```

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173` · Backend API at `http://localhost:3000`

---

## 🐳 Docker Deployment (Backend)

You can run the backend with Docker Compose:

```bash
cd Backend

# Pull and run the container
docker-compose up -d
```

Or build locally:

```bash
docker build -t credenz-backend .
docker run -p 3000:3000 --env-file .env credenz-backend
```

---

## 🔌 API Routes

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/signup` | Register new user | Public |
| `POST` | `/auth/login` | Login with email & password | Public |
| `POST` | `/auth/verify-otp` | Verify email OTP | Public |
| `GET` | `/event` | Get all events | Public |
| `POST` | `/feedback` | Submit feedback | Public |
| `GET` | `/cart` | Get user's cart | 🔒 JWT |
| `POST` | `/cart` | Add event to cart | 🔒 JWT |
| `POST` | `/user/order` | Place order / checkout | 🔒 JWT |
| `GET` | `/pass` | Get event pass | 🔒 JWT |
| `GET` | `/profile` | Get user profile | 🔒 JWT |
| `POST` | `/admin/login` | Admin login | Public |
| `POST` | `/admin/event` | Create/manage events | 🔒 Admin |

---

## 🖥️ Pages

| Route | Page |
|---|---|
| `/` | 🔥 3D Interactive Landing Page |
| `/events` | Events Listing |
| `/events/:eventName` | Event Detail & Registration |
| `/login` | Login |
| `/signup` | Sign Up |
| `/forgot-password` | Password Reset via OTP |
| `/cart` | Shopping Cart *(protected)* |
| `/checkout` | Checkout *(protected)* |
| `/profile` | User Profile & Passes *(protected)* |
| `/about-us` | About Credenz |
| `/sponsors` | Our Sponsors |
| `/web-team` | Meet the Web Team |
| `/contact-us` | Contact Us |

---

## 🔒 Security

- **Helmet.js** — Secure HTTP headers
- **Rate Limiting** — 100 requests / 15 minutes per IP
- **CORS** — Whitelisted origins only (`credenz.co.in`, admin panel, localhost)
- **JWT** — HttpOnly cookie-based token storage
- **Bcrypt** — Password hashing with salt rounds
- **Zod** — Request body schema validation

---

## 🚀 Deployment

🌐 Visit the live site at **[credenz.co.in](https://credenz.co.in)**

---

## 👥 Team

Built with ❤️ by the **Credenz Web Team** — PICT

---

## 📄 License

This project is proprietary software for Credenz, PICT. All rights reserved.

---

<p align="center">
  Made with 🔥 for <strong>Credenz</strong> — Where Passion Meets Technology
</p>
