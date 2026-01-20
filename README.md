# Trescent Lifestyles

Luxury smart home website with interactive moodboard tool, consultation booking, and automated email delivery.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Wouter, Framer Motion
- **Backend**: Node.js, Express, TypeScript, Drizzle ORM
- **Database**: PostgreSQL
- **PDF Generation**: Puppeteer
- **Email**: Resend
- **AI**: OpenAI GPT-4

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) below).

### 3. Push Database Schema

```bash
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

The app runs on `http://localhost:5000` (Vite + Express together).

## Production Build & Deploy

### Build

```bash
npm run build
```

This builds the frontend (Vite) and compiles the backend (esbuild) into `dist/`.

### Start Production Server

```bash
npm start
```

Serves the compiled Express server with built frontend on port 5000.

## Deployment (Railway / Render / etc.)

1. Connect your repository
2. Set environment variables in the platform dashboard
3. Build command: `npm run build`
4. Start command: `npm start`
5. That's it!

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g., `postgresql://user:pass@host:5432/db`) |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `RESEND_API_KEY` | Resend API key for email delivery |
| `SESSION_SECRET` | Secret string for session encryption |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `APP_URL` | Production URL for email links | `https://trescentlifestyles.com` |
| `RESEND_FROM_EMAIL` | Sender email address | `sales-team@trescent.in` |
| `TRESCENT_REPLY_TO_EMAIL` | Reply-to email address | `info@trescentlifestyles.com` |
| `HEYZINE_API_KEY` | Heyzine API key for flipbook generation | - |
| `PHOTOROOM_API_KEY` | Photoroom API key for background removal | - |

## Project Structure

```
/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
├── server/           # Express backend
│   ├── routes.ts
│   ├── storage.ts
│   ├── email-service.ts
│   ├── pdf-generator.ts
│   └── ...
├── shared/           # Shared types & schema
│   └── schema.ts     # Drizzle models
├── attached_assets/  # Images & uploads
├── private/          # Generated PDFs (not public)
├── package.json      # Single root package
├── vite.config.ts
├── drizzle.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite + Express) |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run db:push` | Push schema changes to database |

## License

MIT
