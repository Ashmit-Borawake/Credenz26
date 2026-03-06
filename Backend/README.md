# Credenz26 Backend

A Node.js/TypeScript backend application built with Express, Prisma, and PostgreSQL.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"

# Server Configuration
PORT=3000

# JWT Secret (use a strong random string in production)
JWT_SECRET="your-secret-key-change-this-in-production"
```

**Important:** Replace the placeholder values with your actual database credentials and a secure JWT secret.

### 3. Database Setup

#### Option A: Run Migrations (if database is already set up)
```bash
npm run prisma:migrate
```

#### Option B: Deploy Migrations (for production)
```bash
npm run prisma:deploy
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript project
- `npm run start` - Start production server (requires build first)
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations in development
- `npm run prisma:deploy` - Deploy migrations in production
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files (database, etc.)
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Express middlewares
│   ├── routes/         # API routes
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── index.ts        # Application entry point
├── prisma/
│   ├── migrations/     # Database migrations
│   └── schema.prisma   # Prisma schema
├── generated/
│   └── prisma/         # Generated Prisma Client
└── package.json
```

## API Endpoints

- `/auth` - Authentication routes
- `/admin/event` - Event management (admin)
- `/cart` - Shopping cart operations
- `/pass` - Pass management
- `/price` - Get pricing information
- `/confirm` - Confirm orders

## Development Notes

- The project uses ES modules (`"type": "module"` in package.json)
- Prisma Client is generated to `generated/prisma/`
- TypeScript is configured with strict mode enabled
- Environment variables are loaded using `dotenv`

## Troubleshooting

### Prisma Client not found
Run `npm run prisma:generate` to generate the Prisma Client.

### Database connection errors
- Verify your `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL is running
- Check database credentials and permissions

### Port already in use
Change the `PORT` value in your `.env` file or stop the process using that port.

