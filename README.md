# WirfonCloud Website

Official website for **WirfonCloud** — *Let's rule the clouds*

A custom-built marketing and content platform for WirfonCloud's cloud training, certification, and consultancy services.

## Tech Stack

- **Frontend**: React 19 + Vite 7 + TypeScript (single-page application)
- **Backend**: Node.js + Express (REST API + EJS server-rendered fallback views)
- **Database**: PostgreSQL (production) / JSON file storage (development seed data)
- **Styling**: Hand-authored CSS with brand design tokens
- **Process Manager**: PM2 (production)
- **Reverse Proxy**: Nginx (production)
- **Package Manager**: pnpm workspaces (monorepo)

## Features

- Multi-page responsive website (Home, Academy, Consultancy, Blog, Gallery, About, FAQ)
- Academy course catalog with admin-managed listings
- Consultancy services showcase with testimonials
- Blog with newsletter subscription
- Image gallery with keyboard-navigable lightbox
- Admin panel for content management (login-gated)
- WhatsApp live chat floating action button
- Google Maps location embed
- Brand-consistent dark footer with subscribe form
- Fully responsive across desktop, tablet, and mobile

## Project Structure

This is a pnpm monorepo with the following workspaces:

```
artifacts/
  wirfoncloud/      React + Vite frontend (the public website)
  api-server/       Express API + admin backend
lib/                Shared libraries (typed API client, schemas)
scripts/            Build and maintenance scripts
```

## Getting Started

### Prerequisites

- Node.js v18 or newer
- pnpm v9+
- PostgreSQL (for production)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/wirfoncloud-website.git
cd wirfoncloud-website
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# API server
PORT=8080
NODE_ENV=development
DATABASE_URL=postgres://user:password@localhost:5432/wirfoncloud
SESSION_SECRET=change-me-to-a-long-random-string
ADMIN_EMAIL=admin@wirfon.com
ADMIN_PASSWORD=change-me

# Frontend
VITE_API_BASE_URL=http://localhost:8080
```

### Running Locally

```bash
# Start the API server
pnpm --filter @workspace/api-server run dev

# In a separate terminal, start the frontend
pnpm --filter @workspace/wirfoncloud run dev
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:8080`.

### Production Build

```bash
pnpm build
```

### Deployment

Production runs on a Linux x64 server with:

- Nginx as the reverse proxy and static asset host
- PM2 managing the Node.js API process
- PostgreSQL as the persistent data store

## Admin Panel

Visit `/admin` to manage site content (courses, blog posts, gallery, FAQ, social links). Default development credentials are configured via environment variables.

## License

© YSOTA Ltd. All rights reserved.
